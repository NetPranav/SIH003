# ── Smriti-NER Backend Server Dockerfile ────────────────────────────────────
# Multi-stage minimal container for DISHA-compliant cloud deployment

FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim as runner

# Create non-root user for security compliance
RUN groupadd -r smriti && useradd -r -g smriti -s /bin/false smriti

WORKDIR /app
COPY --from=builder /root/.local /home/smriti/.local
COPY . /app

ENV PATH=/home/smriti/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PORT=8000

USER smriti
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
