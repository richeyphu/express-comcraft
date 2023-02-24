FROM node:18-alpine

WORKDIR /app

### Build image for PRODUCTION, START from here ###

ENV NODE_ENV=production

# Copy project files
COPY package.json .env /app/

# Copy source code
COPY /build /app/build/

# Copy assets
COPY /public/images/nopic.png /public/images/cover.png /app/public/images/

EXPOSE 3000

# Start the server
CMD [ "npm", "run", "start" ]

### Build image for PRODUCTION, END before here ###
