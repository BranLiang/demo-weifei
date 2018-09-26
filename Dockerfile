FROM node:8.11.1

LABEL maintainer="bran@feedmob.com"

WORKDIR /app

# Only copy package.json and yarn.lock instead of all files
COPY package.json ./
COPY yarn.lock ./

# Do not install devDependencies
RUN yarn install
RUN yarn global add serve

# Bundle app source
COPY . .
RUN yarn build

EXPOSE 5000

# Start the server
CMD [ "yarn", "start" ]
