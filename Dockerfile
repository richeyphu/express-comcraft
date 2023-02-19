FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

# Install pnpm
RUN npm -g install pnpm && npm cache clean --force 

# Install dependencies
COPY package.json pnpm-lock.yaml .env /app/
RUN pnpm install && pnpm store prune

# Copy source code
COPY /build /app/build/

EXPOSE 3000

CMD [ "pnpm", "start:build" ]
