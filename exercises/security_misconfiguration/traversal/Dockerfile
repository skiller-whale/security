FROM python:3.11-alpine

RUN apk add shadow
RUN pip install flask

RUN mkdir /secrets

# Bad idea! For exercise purposes only. Don't do this in production.
RUN echo 'i_am_super_secure' > /secrets/secret.txt
RUN chmod -R 400 /secrets

WORKDIR /app
COPY server.py .

CMD python server.py
