FROM node:22.16.0
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run generate
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]