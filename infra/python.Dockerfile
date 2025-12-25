FROM mcr.microsoft.com/playwright/python:v1.45.0-jammy
WORKDIR /app
COPY services/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY services/python /app
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
