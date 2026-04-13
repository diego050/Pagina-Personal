from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ArticleCreate(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str
    slug: str
    image_url: Optional[str] = None
    category: str = "General"
    tags: Optional[str] = None
    is_published: bool = True
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_published: Optional[bool] = None
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class ArticleRead(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    category: str
    tags: Optional[str] = None
    created_at: datetime
    is_published: bool
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class ProjectCreate(BaseModel):
    title: str
    description: str
    image_url: str
    link_url: Optional[str] = None
    tags: str
    slug: str
    content: str
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    content_en: Optional[str] = None
    secondary_link_url: Optional[str] = None
    secondary_link_label: Optional[str] = None
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    tags: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    content_en: Optional[str] = None
    secondary_link_url: Optional[str] = None
    secondary_link_label: Optional[str] = None
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class ProjectRead(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    link_url: Optional[str] = None
    tags: str
    slug: str
    content: str
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    content_en: Optional[str] = None
    secondary_link_url: Optional[str] = None
    secondary_link_label: Optional[str] = None
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class SiteContentBase(BaseModel):
    value: str
    category: Optional[str] = "general"
    label: Optional[str] = None
    input_type: Optional[str] = "text"

class SiteContentCreate(SiteContentBase):
    key: str

class SiteContentRead(SiteContentBase):
    key: str

class SiteContentUpdate(BaseModel):
    value: str

class MediaRenameRequest(BaseModel):
    old_path: str
    new_path: str

class MediaFolderRequest(BaseModel):
    path: str
    name: str

class MediaMetaUpdate(BaseModel):
    filepath: str
    alt_text: Optional[str] = None
    title_tag: Optional[str] = None

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class NewsletterRequest(BaseModel):
    name: str
    email: str
