FROM node:12
WORKDIR /home/ubuntu/applications/vegeten-shop
COPY package*.json ./
RUN npm i
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]