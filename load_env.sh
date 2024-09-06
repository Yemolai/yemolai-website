#!/bin/bash

# Function to load environment variables from a file
load_env() {
    local env_file="$1"
    
    # Check if the file exists
    if [[ ! -f "$env_file" ]]; then
        echo "Error: $env_file not found"
        return 1
    fi
    
    # Read the file line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines and comments
        if [[ -z "$line" || "$line" == \#* ]]; then
            continue
        fi
        
        # Export the variable
        export "$line"
    done < "$env_file"
    
    echo "Environment variables loaded from $env_file"
}

# Main script

# Set default .env file path
DEFAULT_ENV_FILE=".env"

# Use the provided argument or default to .env in the current directory
ENV_FILE="${1:-$DEFAULT_ENV_FILE}"

# Load the environment variables
load_env "$ENV_FILE"
