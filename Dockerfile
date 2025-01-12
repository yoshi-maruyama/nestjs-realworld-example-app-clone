FROM node:20-slim AS base

# パッケージマネージャーのインストール
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps

# nest cliのインストール
RUN pnpm install -g @nestjs/cli

# ホットリロードに必要なpsコマンドをインストール
RUN apt-get update -qq \
  && apt-get install -qy  \
  procps \
  --no-install-recommends

# CMD [ "/bin/bash" ]
