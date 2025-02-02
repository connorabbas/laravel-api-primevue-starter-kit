FROM node:20-alpine

USER root

RUN apk add --no-cache git openssh

USER node
RUN git config --global --add safe.directory /workspace

WORKDIR /workspace

EXPOSE 80

CMD ["sh"]
