FROM node:20-alpine

# Set working directory in the container
WORKDIR /app

# Copy the entire application
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app with migrations and data seeding
# Using migrate deploy for production safety (doesn't make schema changes)
# CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node data/fetch.js && node data/populate_data.js && npm start"]
CMD ["sh", "-c", "npx prisma migrate dev && npx prisma generate && node data/fetch.js && node data/populate_data.js && npm run dev"]
