from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate


router = APIRouter(
    prefix="/clients",
    tags=["Clients"],
)


@router.post(
    "/",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_client(
    client_data: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_client = Client(
        nome=client_data.nome,
        email=client_data.email,
        telefone=client_data.telefone,
        endereco=client_data.endereco,
        nif=client_data.nif,
        user_id=current_user.id,
    )

    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


@router.get(
    "/",
    response_model=list[ClientResponse],
)
def list_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clients = (
        db.query(Client)
        .filter(Client.user_id == current_user.id)
        .order_by(Client.id.desc())
        .all()
    )

    return clients

@router.get(
    "/{client_id}",
    response_model=ClientResponse,
)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = (
        db.query(Client)
        .filter(
            Client.id == client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    return client

@router.put(
    "/{client_id}",
    response_model=ClientResponse,
)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = (
        db.query(Client)
        .filter(
            Client.id == client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    client.nome = client_data.nome
    client.email = client_data.email
    client.telefone = client_data.telefone
    client.endereco = client_data.endereco
    client.nif = client_data.nif

    db.commit()
    db.refresh(client)

    return client

@router.delete(
    "/{client_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = (
        db.query(Client)
        .filter(
            Client.id == client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    db.delete(client)
    db.commit()