FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/generated && chmod -R 777 /app/generated

EXPOSE 3000

CMD ["npm", "start"]