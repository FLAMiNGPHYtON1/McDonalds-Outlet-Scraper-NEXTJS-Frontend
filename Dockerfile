# Use the official Node.js image as the base image
FROM --platform=linux/amd64 node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --include=optional --verbose
# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the app
CMD ["npm", "start"]