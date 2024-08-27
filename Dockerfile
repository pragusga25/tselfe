# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

RUN npm i -g pm2

# Build the app
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start the app
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
