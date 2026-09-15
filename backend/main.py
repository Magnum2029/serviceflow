from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine
from app.models import User, Client, WorkOrder, Quote, Payment
from app.routes.auth import router as auth_router
from app.routes.clients import router as clients_router
from app.routes.payments import router as payments_router
from app.routes.quotes import router as quotes_router
from app.routes.users import router as users_router
from app.routes.work_orders import router as work_orders_router


# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ServiceFlow API",
    description=(
        "API para gestão de clientes, serviços, "
        "orçamentos e pagamentos."
    ),
    version="1.0.0",
)


# Origens autorizadas a acessar a API
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]


# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rotas
app.include_router(users_router)
app.include_router(clients_router)
app.include_router(work_orders_router)
app.include_router(quotes_router)
app.include_router(auth_router)
app.include_router(payments_router)


@app.get("/")
def home():
    return {
        "app": "ServiceFlow",
        "message": "ServiceFlow API online",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }