FROM nginx:alpine

# Copy build files to Nginx's default root directory
WORKDIR /usr/share/nginx/html
COPY build/ .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
