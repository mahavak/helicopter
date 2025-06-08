# Node.js testing environment for Matrixhelicopter
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source code and tests
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

# Install global test utilities
RUN npm install -g jest

# Set environment variables for testing
ENV NODE_ENV=test
ENV CI=true

# Expose port for any potential web server testing
EXPOSE 3000

# Default command runs all tests with verbose output
CMD ["npm", "run", "test:docker"]