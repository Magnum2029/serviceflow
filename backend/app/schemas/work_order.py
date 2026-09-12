from pydantic import BaseModel


class WorkOrderCreate(BaseModel):
    titulo: str
    descricao: str | None = None
    status: str = "pendente"
    valor: float | None = None
    client_id: int


class WorkOrderUpdate(BaseModel):
    titulo: str
    descricao: str | None = None
    status: str
    valor: float | None = None
    client_id: int


class WorkOrderResponse(BaseModel):
    id: int
    titulo: str
    descricao: str | None = None
    status: str
    valor: float | None = None
    client_id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }