FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx knex migrate:latest && npx knex seed:run && node src/app.js"]

