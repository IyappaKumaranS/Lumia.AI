from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llm_engine.app.api.routes import router as llm_router

app = FastAPI(
    title="Lumia AI LLM Backend",
    description="Generates meaningful prompts and chart types from CSV using LLM",
    version="1.0.0"
)

# Enable CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(llm_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Lumia AI backend is running 🚀"}
