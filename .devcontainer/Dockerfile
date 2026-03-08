FROM oven/bun:1

RUN apt-get update && apt-get install -y \
    wget xz-utils git minizinc=2.9.2+dfsg1-1 \
    && wget -qO /tmp/moon.tar.xz https://github.com/moonrepo/moon/releases/download/v2.0.4/moon_cli-x86_64-unknown-linux-gnu.tar.xz \
    && tar -xf /tmp/moon.tar.xz -C /tmp \
    && mv /tmp/moon_cli-x86_64-unknown-linux-gnu/moon* /usr/bin \
    && rm -rf /tmp/moon.tar.xz /tmp/moon \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
USER 1000
