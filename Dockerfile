FROM node:latest
WORKDIR /app

# Copy app
COPY . .

EXPOSE 8433
CMD [ "node", "./bin/www" ]
