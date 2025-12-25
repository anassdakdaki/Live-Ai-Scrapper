FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY services/node/package.json ./services/node/
RUN npm install --workspace services/node --omit=dev
COPY . .
RUN npm run build --workspace services/node
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "services/node"]
