FROM node:20-alpine AS installer
RUN apk add --no-cache git libc6-compat tzdata g++ make py3-pip
RUN apk update
ENV TZ=America/Caracas
WORKDIR /app

# First install dependencies (as they change less often)
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV production
RUN apk add --no-cache tzdata
RUN apk update
ENV TZ=America/Caracas
WORKDIR /app

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app/package*.json .
COPY --from=installer /app/dist ./dist
COPY --from=installer /app/src/variables.env ./src/variables.env
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
