# Use Node 20 (LTS)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# --- DELETED THE BUILD COMMAND BELOW ---
# The line "RUN npm run build" was causing the error because
# your package.json has no "build" script.

# Start the server on port 3000
CMD ["npm", "start"]
