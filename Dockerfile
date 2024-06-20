# Use the official MongoDB image from Docker Hub
FROM mongo:latest

# Set environment variables (optional)
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password

# Copy the MongoDB configuration file (if you have one)
# COPY mongo.conf /etc/mongo/mongo.conf

# Expose the MongoDB port
EXPOSE 27017

# Default command to run MongoDB
CMD ["mongod"]
