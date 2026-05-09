FROM python:3.13-slim

WORKDIR /api

# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Prevent Python buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Copy dependency files first (better Docker cache)
COPY pyproject.toml .

# Install dependencies
RUN python -c "import tomllib, subprocess, pathlib; deps = tomllib.loads(pathlib.Path('pyproject.toml').read_text())['project']['dependencies']; subprocess.run(['pip', 'install', '--no-cache-dir', *deps], check=True)"

# Copy backend source code
COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]