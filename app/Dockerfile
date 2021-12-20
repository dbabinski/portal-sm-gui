FROM node:12.22.7
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm audit fix
CMD ["npm", "run", "serve"]
EXPOSE 8080