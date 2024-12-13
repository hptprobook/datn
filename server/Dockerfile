FROM node:18-alpine

EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Add wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Install nodemon globally
RUN npm install -g nodemon

# Copy source code
COPY . .

CMD ["/wait-for-it.sh", "redis:6379", "--", "npm", "run", "dev"]
