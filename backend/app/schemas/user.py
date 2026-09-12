from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    password: str
    telefone: str | None = None
    profissao: str | None = None
    empresa: str | None = None


class UserResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    telefone: str | None = None
    profissao: str | None = None
    empresa: str | None = None
    ativo: bool

    model_config = {
        "from_attributes": True
    }