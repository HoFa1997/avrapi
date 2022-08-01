FROM node:17-alpine

WORKDIR /

COPY . .

RUN rm -rf node_modules package-lock.json && npm install

EXPOSE 5000

CMD ["node","index.js"] 