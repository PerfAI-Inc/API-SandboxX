# Use the official Node.js image as base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 (or configurable via ENV)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
