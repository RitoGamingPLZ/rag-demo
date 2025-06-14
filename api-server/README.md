RAG Demo (Retrieval-Augmented Generation)

A full-stack Retrieval-Augmented Generation (RAG) system powered by FastAPI, LangChain, and Ollama.

------------------------------------------------------------
Tech Stack:

- AI Model Hosting:     Ollama
- AI Pipeline:          LangChain
- Backend:              FastAPI
- ORM:                  SQLAlchemy
- DB Migration:         Alembic

------------------------------------------------------------
Local Development Setup:

1. Clone the Repository:

   git clone https://github.com/your-username/rag-demo.git
   cd rag-demo

2. Create and Activate Virtual Environment:

   python3 -m venv .venv
   source .venv/bin/activate
   # You should now see: (.venv) username:~/rag-demo

3. Install Dependencies:

   pip install -r requirements.txt

------------------------------------------------------------
Folder Structure:

app/
├── api/         - API route handlers
├── models/      - SQLAlchemy models
├── schemas/     - Pydantic schemas
├── crud/        - Database access logic
├── services/    - Business logic and integrations
├── jobs/        - Scheduled/cron job scripts
├── db.py        - Database engine and session
└── main.py      - FastAPI entry point

------------------------------------------------------------
Database Migrations:

Generate a new migration:

   alembic revision --autogenerate -m "Add your message"

Apply the migration:

   alembic upgrade head

More Info:
- Alembic:      https://alembic.sqlalchemy.org/en/latest/tutorial.html
- SQLAlchemy:   https://www.sqlalchemy.org/

------------------------------------------------------------
API Routes:

Write your FastAPI endpoints under the app/api/ folder using APIRouter.

------------------------------------------------------------
Backend Logic:

Write processing and business logic in the app/services/ folder.

------------------------------------------------------------
Cron Jobs / Background Tasks:

Write scheduled jobs in the app/jobs/ folder.
Use FastAPI startup events or APScheduler to schedule tasks.

------------------------------------------------------------
Coming Soon:

- ✅ Embedding + Document Uploading
- ✅ RAG Query Endpoint
- ⏳ Vector Store (Qdrant or FAISS) integration
- ⏳ Frontend UI (optional)

------------------------------------------------------------
Contributing:

Feel free to fork, clone, and submit pull requests or issues.

------------------------------------------------------------
License:

MIT License
