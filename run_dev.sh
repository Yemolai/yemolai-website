#!/bin/bash
touch .env && \
source ./load_env.sh && \
mix phx.server