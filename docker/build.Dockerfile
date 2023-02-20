FROM node:18-alpine

WORKDIR /app

### Build image for PRODUCTION, START from here ###

ENV NODE_ENV=production

# Copy project files
COPY package.json .env /app/
COPY /build /app/build/

EXPOSE 3000

# Start the server
CMD [ "npm", "run", "start:build" ]

### Build image for PRODUCTION, END before here ###
