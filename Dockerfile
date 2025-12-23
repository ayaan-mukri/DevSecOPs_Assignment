# Use Node.js for React
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy React source code
COPY . .

# React development server runs on 3000
EXPOSE 3000

# Start React app
CMD ["npm", "start"]