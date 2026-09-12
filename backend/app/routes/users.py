from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
password_hash_service = PasswordHash.recommended()



@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado.",
        )

    password_hash = password_hash_service.hash(user_data.password)

    new_user = User(
        nome=user_data.nome,
        email=user_data.email,
        password_hash=password_hash,
        telefone=user_data.telefone,
        profissao=user_data.profissao,
        empresa=user_data.empresa,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user