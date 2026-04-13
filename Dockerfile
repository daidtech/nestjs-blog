# Use official Node.js image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 5555

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh
CMD ["npm", "run", "start:dev"]
