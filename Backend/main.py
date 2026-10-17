from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User
from schemas import UserCreate, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Career & Learning OS")


@app.get("/")
def root():
    return {"message": "AI Career & Learning OS is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/careers")
def get_careers():
    return [
        {"id": 1, "title": "Data Scientist", "category": "Data & AI"},
        {"id": 2, "title": "Data Analyst", "category": "Analytics"},
        {"id": 3, "title": "AI Engineer", "category": "Artificial Intelligence"},
        {"id": 4, "title": "Software Engineer", "category": "Technology"},
    ]


@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        career_goal=user.career_goal,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user