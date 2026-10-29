# Stage 1: build the static files with Node.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# An empty address means "the same site that served this page". The big Nginx sends /api/ to the services.
ENV VITE_API_BASE_URL=""
# The public Turnstile (captcha) site key. Pass it with --build-arg. It is not secret, but it differs per environment.
ARG VITE_TURNSTILE_SITE_KEY=""
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
RUN npm run build

# Stage 2: Nginx as a normal user (not root), on port 8080.
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
