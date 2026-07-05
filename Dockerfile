ARG NODE_VERSION=24.18.0-alpine

# Build de l'application react dans /app/dist
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

# Serveur Node
FROM node:${NODE_VERSION} AS runner

ARG PORT

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["node","dist/main"]
