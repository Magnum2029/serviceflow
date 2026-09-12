from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.quote import Quote
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.quote import QuoteCreate, QuoteResponse, QuoteUpdate


router = APIRouter(
    prefix="/quotes",
    tags=["Quotes"],
)


@router.post(
    "/",
    response_model=QuoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_quote(
    quote_data: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = (
        db.query(Client)
        .filter(
            Client.id == quote_data.client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    new_quote = Quote(
        titulo=quote_data.titulo,
        descricao=quote_data.descricao,
        valor=quote_data.valor,
        status=quote_data.status,
        client_id=quote_data.client_id,
        user_id=current_user.id,
    )

    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)

    return new_quote

@router.get(
    "/",
    response_model=list[QuoteResponse],
)
def list_quotes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quotes = (
        db.query(Quote)
        .filter(Quote.user_id == current_user.id)
        .order_by(Quote.id.desc())
        .all()
    )

    return quotes

@router.get(
    "/{quote_id}",
    response_model=QuoteResponse,
)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quote = (
        db.query(Quote)
        .filter(
            Quote.id == quote_id,
            Quote.user_id == current_user.id,
        )
        .first()
    )

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orçamento não encontrado.",
        )

    return quote

@router.put(
    "/{quote_id}",
    response_model=QuoteResponse,
)
def update_quote(
    quote_id: int,
    quote_data: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quote = (
        db.query(Quote)
        .filter(
            Quote.id == quote_id,
            Quote.user_id == current_user.id,
        )
        .first()
    )

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orçamento não encontrado.",
        )

    client = (
        db.query(Client)
        .filter(
            Client.id == quote_data.client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    quote.titulo = quote_data.titulo
    quote.descricao = quote_data.descricao
    quote.valor = quote_data.valor
    quote.status = quote_data.status
    quote.client_id = quote_data.client_id

    db.commit()
    db.refresh(quote)

    return quote

@router.delete(
    "/{quote_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quote = (
        db.query(Quote)
        .filter(
            Quote.id == quote_id,
            Quote.user_id == current_user.id,
        )
        .first()
    )

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orçamento não encontrado.",
        )

    db.delete(quote)
    db.commit()