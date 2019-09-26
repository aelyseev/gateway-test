FROM node:10.16.3-alpine

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN chown -R node:node /app
USER node

RUN rm package-lock.json
RUN yarn install --production

EXPOSE 3000

CMD [ "yarn", "start" ]
