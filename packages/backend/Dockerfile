FROM python:3.11-slim-bullseye AS builder
WORKDIR /app
ENV POETRY_VERSION=1.8.2
RUN pip install poetry==${POETRY_VERSION}
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --no-interaction --no-ansi
FROM python:3.11-slim-bullseye AS final
WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY . .
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]