<!-- TechStack -->

AI modal hosting: Ollama
AI tool: Langchain
Backend: FastAPI
ORM: SQLAlchemy
DB migration: alembic

<!-- Dev setup -->
<!-- activate virtual python env -->
```
python3 -m venv .venv
source .venv/bin/activate
# you should see (.venv) username:~/rag-demo
pip install -r requirements.txt
```

<!-- Data model -->
write data models under app/models folder
run below commands to generate db migration files
```
alembic revision --autogenerate -m "YOUR MESSAGE HERE"
alembic upgrade head
```

for more information,
https://alembic.sqlalchemy.org/en/latest/tutorial.html
https://www.sqlalchemy.org/

<!-- Route -->
write api endpoints under routes folder

<!-- logic -->
write backend logic under services folder

<!-- job -->
write cron job trigger under jobs folder