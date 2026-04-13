from sqlmodel import SQLModel, create_engine, Session

import os

sqlite_url = os.getenv("DATABASE_URL", "sqlite:///database.db")

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
