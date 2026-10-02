from fastapi import APIRouter, HTTPException

from models.schemas import ChatRequest, ChatResponse
from services.ollama_service import ask_ollama


router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    try:

        answer = ask_ollama(request.question)

        return ChatResponse(
            answer=answer
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Ollama error: {str(e)}"
        )