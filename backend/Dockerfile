FROM node:20-alpine

WORKDIR /app

# Copy EVERY SINGLE FILE - no selective COPY
COPY . .

# Install deps
RUN npm ci --only=production

# Make executable
RUN chmod +x entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/app/entrypoint.sh"]
