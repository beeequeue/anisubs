FROM node:14

WORKDIR /project

COPY . /project
RUN npx lerna bootstrap

ENTRYPOINT ["yarn"]
