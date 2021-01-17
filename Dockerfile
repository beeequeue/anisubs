FROM node:14

ENV HUSKY=0

WORKDIR /project

COPY . /project
RUN npx lerna bootstrap

EXPOSE 5000

ENTRYPOINT ["yarn"]
