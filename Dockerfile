FROM nginx:1.29-alpine

# The release workflow updates both labels before building and commits the
# result, keeping image metadata and the release tag at the same version.
LABEL org.opencontainers.image.title="yush-dump" \
      org.opencontainers.image.description="Static image archive served by nginx" \
      org.opencontainers.image.source="https://github.com/aayusharyan/yush-dump" \
      org.opencontainers.image.version="0.0.0" \
      version="0.0.0"

COPY . /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1
