from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    image_url: str
    link_url: Optional[str] = None
    tags: str  # Comma separated strings
    slug: str = Field(index=True, unique=True)
    content: str  # Markdown content
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    content_en: Optional[str] = None
    secondary_link_url: Optional[str] = None
    secondary_link_label: Optional[str] = None
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True, unique=True)
    excerpt: Optional[str] = None
    content: str # Markdown content
    image_url: Optional[str] = None
    category: str = Field(default="General")
    tags: Optional[str] = None # Comma separated
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_published: bool = Field(default=False)
    image_alt: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None

class SiteContent(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str # Text or JSON string
    category: str = Field(default="general", index=True) # e.g., "home", "about", "social"
    label: str # User-friendly label for Admin UI
    input_type: str = Field(default="text") # "text", "textarea", "json"

class MediaNode(SQLModel, table=True):
    filepath: str = Field(primary_key=True) # Relative path representing the file in static/uploads
    alt_text: Optional[str] = None
    title_tag: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    mime_type: Optional[str] = None
