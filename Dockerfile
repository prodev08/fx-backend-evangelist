FROM node:14-alpine
ARG APPLICATION_PATH=/app
WORKDIR ${APPLICATION_PATH}
COPY . ${APPLICATION_PATH}
RUN npm i -g npm
RUN npm i --unsafe-perm
EXPOSE 8080
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s CMD npm run healthcheck
ENTRYPOINT npm run start
