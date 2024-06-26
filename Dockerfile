FROM node:20
LABEL app = "okaze-reunion"
LABEL version = "v0.1.0"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]