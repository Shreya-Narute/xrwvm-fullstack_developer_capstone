
FROM python:3.9.18-slim-bookworm

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5050

EXPOSE 5050

CMD ["python3", "-m", "flask", "run"]
