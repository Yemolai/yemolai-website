#!/bin/bash
touch .env && \
./load_env.sh && \
mix phx.server