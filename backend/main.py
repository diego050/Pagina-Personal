import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
import shutil
import uuid
from datetime import timedelta
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from PIL import Image
import bleach
import html
from collections import defaultdict
import time

from database import create_db_and_tables, get_session
from models import User, Project, Article, SiteContent, MediaNode
from schemas import (
    Token, ArticleCreate, ArticleRead, ArticleUpdate, 
    ProjectCreate, ProjectRead, ProjectUpdate,
    SiteContentRead, SiteContentUpdate,
    MediaRenameRequest, MediaFolderRequest, MediaMetaUpdate,
    ContactRequest, NewsletterRequest
)
from auth import verify_password, create_access_token, get_current_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES

load_dotenv()

# --- Security Helpers ---
def sanitize_text(text: str, mode: str = "strict") -> str:
    if not text or not isinstance(text, str):
        return text
        
    if mode == "strict":
        # Neutralize all HTML tags (best for public forms)
        return html.escape(text)
    
    if mode == "content":
        # Allow safe tags for Blog/Projects (CMS)
        allowed_tags = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
            'p', 'br', 'hr', 'blockquote', 'pre', 'code',
            'ul', 'ol', 'li', 'span', 'div', 'strong', 'em', 'u', 's',
            'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ]
        allowed_attrs = {
            'a': ['href', 'title', 'target', 'rel', 'class'],
            'img': ['src', 'alt', 'title', 'width', 'height', 'class'],
            '*': ['class', 'id', 'style'] 
        }
        return bleach.clean(text, tags=allowed_tags, attributes=allowed_attrs, strip=True)
    
    return text
    
# --- Bot & Spam Protection ---
# Simple in-memory rate limiter (resets on server restart)
# In a production environment with high traffic, use Redis
ip_request_counts = defaultdict(list)

def check_rate_limit(ip: str, limit: int = 5, window: int = 60):
    """
    Allows 'limit' requests per 'window' seconds per IP.
    """
    now = time.time()
    # Filter out old requests
    ip_request_counts[ip] = [t for t in ip_request_counts[ip] if now - t < window]
    
    if len(ip_request_counts[ip]) >= limit:
        return False
    
    ip_request_counts[ip].append(now)
    return True
# ------------------------
# ------------------------

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "success", "message": "DBtech Backend is running on Hostinger VPS"}

# Mount static directory for uploaded images
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin user data from environment variables
import io

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), path: str = Form(""), session: Session = Depends(get_session)):
    import os
    base_dir = os.path.abspath("static/uploads")
    target_dir = os.path.abspath(os.path.join(base_dir, path))
    
    if not target_dir.startswith(base_dir):
        raise HTTPException(status_code=400, detail="Invalid path")
        
    os.makedirs(target_dir, exist_ok=True)
    
    filename, ext = os.path.splitext(file.filename)
    if ext.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
        # It's an image, let's optimize and convert
        img_bytes = await file.read()
        try:
            with Image.open(io.BytesIO(img_bytes)) as img:
                # Keep transparency for WebP
                if img.mode in ("RGBA", "P"):
                    if img.mode == "P":
                        img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                
                width, height = img.size
                base_name = f"{filename}.webp"
                file_path = os.path.join(target_dir, base_name)
                
                # Save original webp
                img.save(file_path, "WEBP", quality=80)
                
                # Sizes to generate
                sizes = {
                    "sm": 400,
                    "md": 800,
                    "lg": 1200
                }
                
                for suffix, max_w in sizes.items():
                    if width > max_w:
                        ratio = max_w / float(width)
                        new_h = int(float(height) * float(ratio))
                        resized_img = img.resize((max_w, new_h), Image.Resampling.LANCZOS)
                        resized_img.save(os.path.join(target_dir, f"{filename}-{suffix}.webp"), "WEBP", quality=80)
                    else:
                        # Ensure the variant file always exists to prevent frontend 404 errors
                        img.save(os.path.join(target_dir, f"{filename}-{suffix}.webp"), "WEBP", quality=80)
                
                rel_path = os.path.relpath(file_path, "static/uploads").replace("\\", "/")
                
                # Create MediaNode
                node = session.get(MediaNode, rel_path)
                if not node:
                    node = MediaNode(filepath=rel_path, width=width, height=height, mime_type="image/webp")
                    session.add(node)
                else:
                    node.width = width
                    node.height = height
                    node.mime_type = "image/webp"
                session.commit()
                
                return {"url": f"/static/uploads/{rel_path}"}
        except Exception as e:
            # Fallback to normal upload if Pillow fails
            file.file.seek(0)
            pass
            
    # Fallback for non-images
    file_path = os.path.join(target_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    rel_path = os.path.relpath(file_path, "static/uploads").replace("\\", "/")
    
    # Store at least mime_type even if not image
    node = session.get(MediaNode, rel_path)
    if not node:
        node = MediaNode(filepath=rel_path, mime_type=file.content_type)
        session.add(node)
        session.commit()
        
    return {"url": f"/static/uploads/{rel_path}"}

@app.get("/media")
def read_media(path: str = "", session: Session = Depends(get_session)):
    import os
    base_dir = os.path.abspath("static/uploads")
    media_dir = os.path.abspath(os.path.join(base_dir, path))
    
    if not media_dir.startswith(base_dir):
        raise HTTPException(status_code=400, detail="Invalid path")
        
    if not os.path.exists(media_dir):
        return []
    
    items = []
    base_url = "/static/uploads/"
    
    for filename in os.listdir(media_dir):
        if filename.endswith(("-sm.webp", "-md.webp", "-lg.webp")):
            continue
            
        filepath = os.path.join(media_dir, filename)
        rel_path = os.path.relpath(filepath, "static/uploads").replace("\\", "/")
        is_dir = os.path.isdir(filepath)
        
        node = session.get(MediaNode, rel_path) if not is_dir else None
        
        items.append({
            "name": filename,
            "url": f"{base_url}{rel_path}" if not is_dir else None,
            "path": rel_path,
            "size": os.path.getsize(filepath) if not is_dir else 0,
            "type": "folder" if is_dir else "file",
            "alt_text": node.alt_text if node else "",
            "title_tag": node.title_tag if node else "",
            "width": node.width if node else None,
            "height": node.height if node else None,
            "mime_type": node.mime_type if node else None
        })
    
    items.sort(key=lambda x: (x["type"] != "folder", x["name"]))
    return items

@app.post("/media/folder")
def create_media_folder(req: MediaFolderRequest):
    import os
    base_dir = os.path.abspath("static/uploads")
    target_dir = os.path.abspath(os.path.join(base_dir, req.path, req.name))
    
    if not target_dir.startswith(base_dir):
        raise HTTPException(status_code=400, detail="Invalid path")
        
    os.makedirs(target_dir, exist_ok=True)
    return {"status": "success"}

@app.put("/media/rename")
def rename_media(req: MediaRenameRequest, session: Session = Depends(get_session)):
    import os
    base_dir = os.path.abspath("static/uploads")
    old_path = os.path.abspath(os.path.join(base_dir, req.old_path))
    new_path = os.path.abspath(os.path.join(base_dir, req.new_path))
    
    if not old_path.startswith(base_dir) or not new_path.startswith(base_dir):
        raise HTTPException(status_code=400, detail="Invalid path")
        
    if not os.path.exists(old_path):
        raise HTTPException(status_code=404, detail="Source not found")
        
    os.rename(old_path, new_path)
    
    # Update DB if exists
    node = session.get(MediaNode, req.old_path)
    if node:
        new_node = MediaNode(filepath=req.new_path, alt_text=node.alt_text, title_tag=node.title_tag)
        session.delete(node)
        session.add(new_node)
        session.commit()
        
    return {"status": "success"}

@app.put("/media/meta")
def update_media_meta(req: MediaMetaUpdate, session: Session = Depends(get_session)):
    node = session.get(MediaNode, req.filepath)
    if node:
        node.alt_text = req.alt_text
        node.title_tag = req.title_tag
        session.add(node)
    else:
        new_node = MediaNode(filepath=req.filepath, alt_text=req.alt_text, title_tag=req.title_tag)
        session.add(new_node)
    
    session.commit()
    return {"status": "success"}

@app.delete("/media")
def delete_media(path: str, session: Session = Depends(get_session)):
    import os
    import shutil
    base_dir = os.path.abspath("static/uploads")
    target_path = os.path.abspath(os.path.join(base_dir, path))
    
    if not target_path.startswith(base_dir):
        raise HTTPException(status_code=400, detail="Invalid path")
        
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File or folder not found")
        
    if os.path.isdir(target_path):
        shutil.rmtree(target_path)
        # We might want to cascade delete all MediaNodes under this path in future
    else:
        os.remove(target_path)
        node = session.get(MediaNode, path)
        if node:
            session.delete(node)
            session.commit()
            
    return {"status": "success"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Create initial admin user from env
    session = next(get_session())
    admin_user = os.getenv("ADMIN_USERNAME", "admin")
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin")
    
    user = session.exec(select(User).where(User.username == admin_user)).first()
    if not user:
        hashed_pw = get_password_hash(admin_pass)
        admin = User(username=admin_user, hashed_password=hashed_pw)
        session.add(admin)
        session.commit()

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
def create_user(user: User, session: Session = Depends(get_session)):
    user.hashed_password = get_password_hash(user.hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/articles", response_model=List[ArticleRead])
def read_articles(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    articles = session.exec(select(Article).offset(skip).limit(limit)).all()
    return articles

@app.get("/articles/{slug}", response_model=ArticleRead)
def read_article(slug: str, session: Session = Depends(get_session)):
    article = session.exec(select(Article).where(Article.slug == slug)).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

import json
from datetime import datetime

def backup_database(session: Session):
    """
    Backs up the database content to a JSON file.
    """
    try:
        articles = session.exec(select(Article)).all()
        projects = session.exec(select(Project)).all()
        content = session.exec(select(SiteContent)).all()

        backup_data = {
            "timestamp": datetime.now().isoformat(),
            "articles": [a.dict() for a in articles],
            "projects": [p.dict() for p in projects],
            "content": [c.dict() for c in content]
        }

        with open("backup.json", "w", encoding="utf-8") as f:
            json.dump(backup_data, f, indent=4, default=str)
        
        print("Backup created successfully.")
    except Exception as e:
        print(f"Error creating backup: {e}")

@app.post("/articles", response_model=ArticleRead)
def create_article(article: ArticleCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    article.title = sanitize_text(article.title)
    article.excerpt = sanitize_text(article.excerpt)
    article.content = sanitize_text(article.content, mode="content")
    
    db_article = Article.from_orm(article)
    session.add(db_article)
    session.commit()
    session.refresh(db_article)
    backup_database(session)
    return db_article

@app.get("/projects", response_model=List[ProjectRead])
def read_projects(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    projects = session.exec(select(Project).order_by(Project.id.desc()).offset(skip).limit(limit)).all()
    return projects

@app.get("/projects/{slug}", response_model=ProjectRead)
def read_project_by_slug(slug: str, session: Session = Depends(get_session)):
    project = session.exec(select(Project).where(Project.slug == slug)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects", response_model=ProjectRead)
def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    project.title = sanitize_text(project.title)
    project.description = sanitize_text(project.description)
    project.content = sanitize_text(project.content, mode="content")
    if project.title_en: project.title_en = sanitize_text(project.title_en)
    if project.description_en: project.description_en = sanitize_text(project.description_en)
    if project.content_en: project.content_en = sanitize_text(project.content_en, mode="content")
    
    db_project = Project.from_orm(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    backup_database(session)
    return db_project

@app.put("/articles/{article_id}", response_model=ArticleRead)
def update_article(article_id: int, article: ArticleUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_article = session.get(Article, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article_data = article.dict(exclude_unset=True)
    for key, value in article_data.items():
        if key in ["title", "excerpt"] and isinstance(value, str):
            value = sanitize_text(value)
        elif key == "content" and isinstance(value, str):
            value = sanitize_text(value, mode="content")
        setattr(db_article, key, value)
        
    session.add(db_article)
    session.commit()
    session.refresh(db_article)
    backup_database(session)
    return db_article

@app.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project: ProjectUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_data = project.dict(exclude_unset=True)
    for key, value in project_data.items():
        if key in ["title", "description", "title_en", "description_en"] and isinstance(value, str):
            value = sanitize_text(value)
        elif key in ["content", "content_en"] and isinstance(value, str):
            value = sanitize_text(value, mode="content")
            
        setattr(db_project, key, value)
        
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    backup_database(session)
    return db_project

@app.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(article_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    session.delete(article)
    session.commit()
    backup_database(session)
    return None

@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    backup_database(session)
    return None

@app.get("/content", response_model=List[SiteContentRead])
def read_content(category: str = None, session: Session = Depends(get_session)):
    query = select(SiteContent)
    if category:
        query = query.where(SiteContent.category == category)
    content = session.exec(query).all()
    return content

@app.put("/content/{key}", response_model=SiteContentRead)
def update_content(key: str, content_update: SiteContentUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_content = session.get(SiteContent, key)
    if not db_content:
        raise HTTPException(status_code=404, detail="Content key not found")
    
    # Sanitize CMS content value
    db_content.value = sanitize_text(content_update.value, mode="content")
    session.add(db_content)
    session.commit()
    session.refresh(db_content)
    backup_database(session)
    return db_content

# NEW: Contact Form Endpoint
@app.post("/contact")
async def contact_form(req: ContactRequest, request: Request, session: Session = Depends(get_session)):
    # 1. Honeypot check (hidden field bots fill)
    if req.honeypot:
        print(f"Honeypot triggered! Bot detected from IP: {request.client.host}")
        return {"status": "success", "message": "Message sent (ignored)"}

    # 2. Rate Limit (3 messages per 10 minutes)
    if not check_rate_limit(request.client.host, limit=3, window=600):
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")
    
    # Retrieve env settings
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    recipient = os.getenv("CONTACT_RECIPIENT")

    try:
        # Sanitize contact inputs strictly
        clean_name = sanitize_text(req.name)
        clean_email = sanitize_text(req.email)
        clean_message = sanitize_text(req.message)

        if not smtp_user or not smtp_pass or not recipient:
            print(f"Contact form received (Simulated): Name: {clean_name}, Email: {clean_email}, Msg: {clean_message}")
            return {"status": "success", "message": "Received (Simulated)"}

        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = recipient
        msg["Subject"] = f"New Contact from {clean_name} - DBtech Portfolio"
        
        body = f"Name: {clean_name}\nEmail: {clean_email}\n\nMessage:\n{clean_message}"
        msg.attach(MIMEText(body, "plain"))

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        
        return {"status": "success"}
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@app.post("/subscribe")
async def subscribe_newsletter(req: NewsletterRequest, request: Request):
    # 1. Honeypot check
    if req.honeypot:
        print(f"Newsletter Honeypot triggered from IP: {request.client.host}")
        return {"status": "success", "message": "Subscribed (ignored)"}

    # 2. Rate Limit (5 subscriptions per hour)
    if not check_rate_limit(request.client.host, limit=5, window=3600):
        raise HTTPException(status_code=429, detail="Too many subscription attempts. Please try again later.")
    
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    recipient = os.getenv("CONTACT_RECIPIENT")

    try:
        # Sanitize newsletter inputs strictly
        clean_name = sanitize_text(req.name)
        clean_email = sanitize_text(req.email)

        if not smtp_user or not smtp_pass or not recipient:
            print(f"Newsletter subscription (Simulated): Name: {clean_name}, Email: {clean_email}")
            return {"status": "success", "message": "Received (Simulated)"}

        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = recipient
        msg["Subject"] = f"New Newsletter Subscription: {clean_name}"
        
        body = f"A new person has subscribed to your newsletter!\n\nName: {clean_name}\nEmail: {clean_email}"
        msg.attach(MIMEText(body, "plain"))

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        
        return {"status": "success"}
    except Exception as e:
        print(f"SMTP Error during subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to process subscription")

# NEW: SEO Endpoints
@app.get("/robots.txt", response_class=Response)
def get_robots():
    frontend_url = os.getenv("FRONTEND_URL", "https://dbtech.cloud")
    content = f"User-agent: *\nAllow: /\nSitemap: {frontend_url}/sitemap.xml"
    return Response(content=content, media_type="text/plain")

@app.get("/sitemap.xml")
def get_sitemap(session: Session = Depends(get_session)):
    SITE_URL = "https://dbtech.cloud"
    
    # 1. Translation Map for static routes
    # Map: ES_path -> EN_path
    static_map = {
        "/": "/en",
        "/sobre-mi": "/en/about",
        "/proyectos": "/en/projects",
        "/blog": "/en/blog"
    }
    
    # Inverse map for EN -> ES
    inverse_static_map = {v: k for k, v in static_map.items()}
    
    # List of all paths for which we want a sitemap entry
    all_paths = list(static_map.keys()) + list(static_map.values())
    
    # 2. Dynamic Projects
    projects = session.exec(select(Project)).all()
    for p in projects:
        if p.slug:
            all_paths.append(f"/project/{p.slug}")
            all_paths.append(f"/en/project/{p.slug}")
            
    # 3. Dynamic Articles
    articles = session.exec(select(Article).where(Article.is_published == True)).all()
    for a in articles:
        if a.slug:
            all_paths.append(f"/blog/{a.slug}")
            all_paths.append(f"/en/blog/{a.slug}")

    # Generate XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    ]
    
    for path in all_paths:
        full_url = f"{SITE_URL}{path}"
        
        # Logic to find the alternate URL
        alternate_url = None
        current_lang = "en" if path.startswith("/en") else "es"
        
        if path in static_map: # It's a Spanish static route
            alternate_url = f"{SITE_URL}{static_map[path]}"
        elif path in inverse_static_map: # It's an English static route
            alternate_url = f"{SITE_URL}{inverse_static_map[path]}"
        elif path.startswith("/en/"): # It's an English dynamic route
            alt_path = path.replace("/en/", "/")
            alternate_url = f"{SITE_URL}{alt_path}"
        else: # It's a Spanish dynamic route
            alt_path = f"/en{path}"
            alternate_url = f"{SITE_URL}{alt_path}"
            
        xml_lines.append(f'    <url>')
        xml_lines.append(f'        <loc>{full_url}</loc>')
        xml_lines.append(f'        <changefreq>weekly</changefreq>')
        xml_lines.append(f'        <priority>{"1.0" if path == "/" or path == "/en" else "0.8"}</priority>')
        if alternate_url:
            xml_lines.append(f'        <xhtml:link rel="alternate" hreflang="{"en" if current_lang == "es" else "es"}" href="{alternate_url}"/>')
            xml_lines.append(f'        <xhtml:link rel="alternate" hreflang="{current_lang}" href="{full_url}"/>')
        xml_lines.append(f'    </url>')
        
    xml_lines.append('</urlset>')
    
    return Response(content="\n".join(xml_lines), media_type="application/xml")
