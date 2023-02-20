FROM node:18-alpine

WORKDIR /app

## Build image for DEVELOPMENT, START from here ### 

ENV NODE_ENV=development

# Install pnpm
RUN npm -g install pnpm && npm cache clean --force 

# Install dependencies
COPY package.json pnpm-lock.yaml tsconfig.json .env /app/
RUN pnpm install && pnpm store prune

# Copy source code
COPY /src /app/src/

EXPOSE 3000

# Start the server
CMD [ "pnpm", "start" ]

## Build image for DEVELOPMENT, END before here ### 
