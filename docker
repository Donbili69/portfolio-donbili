# Use Node 20 (LTS)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Start the server on port 3000
CMD ["npm", "start"]