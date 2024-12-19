# Use the official Node.js image as a base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

COPY data.env data.env

# Expose the application port
EXPOSE 3001

# Command to start the application
CMD ["npm", "start"]
