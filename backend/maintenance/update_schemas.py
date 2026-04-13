import re

with open("schemas.py", "r", encoding="utf-8") as f:
    content = f.read()

# Update ArticleCreate
content = content.replace(
    'tags: Optional[str] = None\n    is_published: bool = True',
    'tags: Optional[str] = None\n    is_published: bool = True\n    image_alt: Optional[str] = None\n    image_width: Optional[int] = None\n    image_height: Optional[int] = None'
)

# Update ArticleUpdate
content = content.replace(
    'tags: Optional[str] = None\n    is_published: Optional[bool] = None',
    'tags: Optional[str] = None\n    is_published: Optional[bool] = None\n    image_alt: Optional[str] = None\n    image_width: Optional[int] = None\n    image_height: Optional[int] = None'
)

# Update ArticleRead
content = content.replace(
    'created_at: datetime\n    is_published: bool',
    'created_at: datetime\n    is_published: bool\n    image_alt: Optional[str] = None\n    image_width: Optional[int] = None\n    image_height: Optional[int] = None'
)

# Replace project fields
content = content.replace(
    'secondary_link_label: Optional[str] = None',
    'secondary_link_label: Optional[str] = None\n    image_alt: Optional[str] = None\n    image_width: Optional[int] = None\n    image_height: Optional[int] = None'
)

with open("schemas.py", "w", encoding="utf-8") as f:
    f.write(content)
