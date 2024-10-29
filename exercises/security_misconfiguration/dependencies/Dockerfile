FROM python:3.10-alpine

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY src ./src
COPY static ./static

RUN python src/setup_script.py
EXPOSE 8001

CMD ["python", "src/server.py"]
