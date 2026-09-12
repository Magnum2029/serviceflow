from pydantic import BaseModel


class QuoteCreate(BaseModel):
    titulo: str
    descricao: str | None = None
    valor: float
    status: str = "pendente"
    client_id: int
    
class QuoteUpdate(BaseModel):
    titulo: str
    descricao: str | None = None
    valor: float
    status: str
    client_id: int


class QuoteResponse(BaseModel):
    id: int
    titulo: str
    descricao: str | None = None
    valor: float
    status: str
    client_id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }