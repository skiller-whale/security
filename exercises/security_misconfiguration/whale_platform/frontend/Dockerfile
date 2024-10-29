FROM node:20.8.1-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# production environment
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
