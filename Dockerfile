FROM node:8

ARG NODE_ENV

RUN mkdir -p /usr/src/node_skeleton
WORKDIR /usr/src/node_skeleton

COPY package.json /usr/src/node_skeleton/

# Install nodemon, followed by our application dependencies
RUN npm install -g nodemon
RUN npm install

# Deploy
COPY . /usr/src/node_skeleton
COPY env-$NODE_ENV.env .env

# Set
ENV NODE_ENV development

EXPOSE 3000

CMD [ "npm", "start" ]
