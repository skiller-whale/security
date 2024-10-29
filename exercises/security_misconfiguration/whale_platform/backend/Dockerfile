FROM node:20.8.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV BACKEND_DAO="memory"
ENV BACKEND_HOST, BACKEND_PORT

ENTRYPOINT [ "node" ]
CMD ["src/server.js"]
