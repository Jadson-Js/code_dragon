FROM node:lts-alpine

WORKDIR /app

# Instala dependências antes para aproveitar cache do Docker
COPY package*.json ./
RUN npm install

# Copia arquivos do prisma e gera o client para garantir que esteja pronto na build
COPY prisma ./prisma
# Gera o cliente Prisma na build para acelerar o startup
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Garante permissões na pasta gerada
RUN mkdir -p /app/generated && chmod -R 777 /app/generated

EXPOSE 3000

# O comando npm start fará o setup do banco com o wait-for-db
CMD ["npm", "start"]