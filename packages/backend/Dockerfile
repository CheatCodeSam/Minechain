FROM docker.io/node:lts-alpine

LABEL com.minechain.name="Minechain Backend Nest.js Server"
LABEL com.minechain.image.authors="mail@carsonweeks.com"

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system backend && \
          adduser --system -G backend backend

COPY dist/packages/backend backend
RUN chown -R backend:backend .

RUN npm --prefix backend --omit=dev -f install

CMD [ "node", "backend" ]
