FROM node:18-alpine

EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy source code
COPY . .

CMD ["redis:6379", "--", "npm", "run", "dev"]
