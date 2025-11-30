# Use Node.js as the build environment
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json, install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .