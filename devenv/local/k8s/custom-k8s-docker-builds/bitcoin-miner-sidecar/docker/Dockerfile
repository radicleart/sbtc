FROM alpine:latest
MAINTAINER Gowtham Sundar <gowtham@trustmachines.co>

RUN apk add --no-cache curl jq

ARG BITCOIN_RPC_HOST
ARG BITCOIN_RPC_PORT
ARG MINER_ADDRESS
ARG INIT_BTC_BLOCKS
ARG BTC_BLOCK_GEN_TIME
ARG BTC_RPCPASSWORD
ARG BTC_RPCUSER
ARG BTC_LOG_DEBUG
ARG BTC_REST_ENABLE


ENV BITCOIN_RPC_HOST=$BITCOIN_RPC_HOST
ENV BITCOIN_RPC_PORT=$BITCOIN_RPC_PORT
ENV MINER_ADDRESS=$MINER_ADDRESS
ENV INIT_BTC_BLOCKS=$INIT_BTC_BLOCKS
ENV BTC_BLOCK_GEN_TIME=$BTC_BLOCK_GEN_TIME
ENV BTC_RPCPASSWORD=$BTC_RPCPASSWORD
ENV BTC_RPCUSER=$BTC_RPCUSER
ENV BTC_LOG_DEBUG=$BTC_LOG_DEBUG
ENV BTC_REST_ENABLE=$BTC_REST_ENABLE


COPY entrypoint.sh /bin/entrypoint.sh

RUN chmod a+x /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]
