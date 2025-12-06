#!/bin/bash

mkdir -p tmp

# Run container in detached mode and capture its ID
container_id=$(docker run -d -it dicky1031/yoloflow:latest)

# Copy /app folder from container to local tmp directory
docker cp "$container_id":/app tmp

# (Optional) stop the container after copying
docker stop "$container_id"
