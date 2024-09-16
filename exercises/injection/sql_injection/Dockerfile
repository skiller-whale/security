FROM node:22-alpine AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY --from=builder --link /app/build /app/public

CMD ["node", "--watch", "src/server.js"]
