FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --production

COPY . .

# Seed banco de dados se não existir
RUN npm run db:create || true

EXPOSE 5000

CMD ["npm", "start"]
escaneie todo o codigo e corrija o que está incoerente. nao estou conseguindo fazer cadastro de administradores, deixe o orientador como está. você só precisa entender que o orientador tem direito a absolutamente tudo e já tem uma conta pré-cadastrada, enquanto todos os administradores tem direitos a tudo (exclusão, inclusão, administram os grupos) menos de gerenciar o orientador. além disso, os mentores gerenciam apenas seus calouros, não os grupos em que estão inseridos, você precisa entender toda essa relação para fazer a aplicação funcionar corretamente, entendeu? 
orientador -> administrador -> grupos -> mentores -> calouros
