# vim: set ts=2 sw=2 et tw=80:
FROM node:current-alpine
MAINTAINER info@vimtok.com

RUN mkdir /app && adduser vimtok -h /app -s /sbin/nologin -D
RUN apk update \
  && apk add --no-cache ffmpeg python3 \
  && ln -s /usr/bin/python3 /usr/bin/python
COPY . /app
RUN cd /app \
  && chown -R vimtok . \
  && npm install \
  && npm run nunjucks

USER vimtok
CMD node /app/bin/www
