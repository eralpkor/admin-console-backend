FROM node:17

# working dir
WORKDIR /usr/src/admin_backend

# grab package and package log
COPY package*.json ./

# install Prettier (for package's build function)
RUN npm install prettier -g

# install pm2 for always running app
RUN npm install pm2 -g

# install files
RUN npm install

# Copy source files everything exept dockerignore
COPY . .

# Build
RUN npm run build

# Expose the API port
EXPOSE 5000

CMD [ "pm2-runtime", "process.config.js" ]