from pydantic import BaseModel, EmailStr


class ClientCreate(BaseModel):
    nome: str
    email: EmailStr | None = None
    telefone: str | None = None
    endereco: str | None = None
    nif: str | None = None

class ClientUpdate(BaseModel):
    nome: str
    email: EmailStr | None = None
    telefone: str | None = None
    endereco: str | None = None
    nif: str | None = None

class ClientResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr | None = None
    telefone: str | None = None
    endereco: str | None = None
    nif: str | None = None
    user_id: int

    model_config = {
        "from_attributes": True
    }