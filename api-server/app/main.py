from fastapi import FastAPI
# from app.db import AsyncSessionLocal
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_ollama import OllamaLLM

llm = OllamaLLM(model="deepseek-r1:1.5b")

class Item(BaseModel):
    question: str

# Optional: import your routers (if using modular routing)
# from app.routers import chat

app = FastAPI(title="RAG Chatbot API")

# Enable CORS (for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "ok"}

# Dependency override example
@app.on_event("startup")
async def startup_event():
    print("Backend is starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down backend...")

@app.post("/chat")
async def chat_endpoint(item: Item):
    # Placeholder for chat logic
    question = item.question
    result = llm.invoke(question)
    return {"response": f"Echo: {result}"}