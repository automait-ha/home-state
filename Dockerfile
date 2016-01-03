FROM node:4.2.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

VOLUME [ "/config" ]

CMD [ "node", "index.js", "/config/config.json" ]
