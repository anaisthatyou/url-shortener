FROM node:latest

WORKDIR /usr/shorturl/

COPY package*.json ./
COPY src ./src
COPY public ./public
COPY tsconfig.json ./

RUN npm install
RUN npm run build

CMD [ "node", "dist/index.js" ]
