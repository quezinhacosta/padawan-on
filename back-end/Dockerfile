FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --production

COPY . .

# Seed banco de dados se não existir
RUN npm run db:create || true

EXPOSE 5000

CMD ["npm", "start"]

