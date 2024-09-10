#!/bin/bash

# Set default .env file path
DEFAULT_ENV_FILE=".env"

# Use the provided argument or default to .env in the current directory
ENV_FILE="${1:-$DEFAULT_ENV_FILE}"

env_file="$ENV_FILE"
echo "Loading env file: $env_file"

# Check if the file exists
if [[ ! -f "$env_file" ]]; then
    echo "Error: $env_file not found"
    exit 1
fi

# Read the file line by line
while IFS="=" read -r key value || [[ -n "$line" ]]; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" == \#* ]]; then
        continue
    fi

    # Export the variable
    echo "loading $key"
    export "$key=$value"
    
done < "$env_file"

echo "Environment variables loaded from $env_file"
