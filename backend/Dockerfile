FROM node:22-alpine

WORKDIR /app

# Parchear paquetes del OS para reducir CVEs de la imagen base
RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN chmod +x entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["sh", "entrypoint.sh"]
