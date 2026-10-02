from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router


app = FastAPI(
    title="Coding Agent API",
    description="AI Coding Agent powered by Ollama",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# --------------------------------------------------
# Routes
# --------------------------------------------------

app.include_router(chat_router)


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
async def root():

    return {
        "message": "Coding Agent API is running",
        "status": "success"
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
async def health():

    return {
        "status": "healthy"
    }