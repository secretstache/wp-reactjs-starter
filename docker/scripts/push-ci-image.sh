#!/bin/sh

# Push the latest built CI dockerfile ./container/ci/Dockerfile.

if [ -z "$VERSION" ]; then
    VERSION=$(node -e "console.log(require('./package.json').version)")
fi

DOCKER_HUB_USERNAME=$(node -e "console.log(require('./package.json')['docker-hub-username'] || '')")
CONTAINER_NAME=$(node -e "console.log(require('./package.json')['docker-ci-image-name'] || '')")

docker tag "$CONTAINER_NAME:$VERSION" "$DOCKER_HUB_USERNAME/$CONTAINER_NAME:$VERSION"
docker push "$DOCKER_HUB_USERNAME/$CONTAINER_NAME:$VERSION"
docker tag "$CONTAINER_NAME:$VERSION" "$DOCKER_HUB_USERNAME/$CONTAINER_NAME:latest"
docker push "$DOCKER_HUB_USERNAME/$CONTAINER_NAME:latest"
