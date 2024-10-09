FROM python:3.11-alpine

VOLUME /src
WORKDIR /src
RUN mkdir /src/app

EXPOSE 5000

RUN pip3 install flask
CMD python -m flask --app app run --debug --host=0.0.0.0
