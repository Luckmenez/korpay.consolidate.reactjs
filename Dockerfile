FROM node:23-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]