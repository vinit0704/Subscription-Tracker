# Step 1: Build Next.js App with Node 22
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Step 2: Run Next.js App in production
FROM node:22-alpine

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Next.js production start
CMD ["npm", "start"]
