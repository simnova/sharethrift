#!/bin/bash

# ShareThrift Local HTTPS Certificate Setup
# This script installs mkcert and generates wildcard SSL certificates for local development

set -e


# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo " mkcert not found. Installing..."
    
    # Detect OS and install mkcert
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mkcert
        else
            echo "Error: Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y mkcert
        elif command -v yum &> /dev/null; then
            sudo yum install -y mkcert
        else
            echo "❌ Error: Package manager not supported. Please install mkcert manually:"
            echo "   https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    else
        echo "❌ Error: OS not supported. Please install mkcert manually:"
        echo "   https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
else
    echo " mkcert already installed"
fi

# Install the local CA
echo ""
echo " Installing local Certificate Authority..."
mkcert -install

# Generate wildcard certificate for *.sharethrift.localhost
echo ""
echo " Generating wildcard certificate for *.sharethrift.localhost..."
cd "$(dirname "$0")"
mkcert "*.sharethrift.localhost" "sharethrift.localhost" localhost 127.0.0.1 ::1

# Rename files to standard names
mv ./*.localhost+4.pem sharethrift.localhost.pem 2>/dev/null || true
mv ./*.localhost+4-key.pem sharethrift.localhost-key.pem 2>/dev/null || true

echo ""
echo " Certificate setup complete!"
echo ""
echo " Certificate files created in:"
echo "   $(pwd)"
echo ""
echo " Certificates:"
echo "   - sharethrift.localhost.pem (certificate)"
echo "   - sharethrift.localhost-key.pem (private key)"
echo ""
echo " Your local domains are now trusted for HTTPS:"
echo "   - https://sharethrift.localhost:3000 (UI)"
echo "   - https://api.sharethrift.localhost:7071 (API)"
echo "   - https://developers.sharethrift.localhost:3002 (Docs)"
echo ""
echo " Next steps:"
echo "   1. Run: pnpm install"
echo "   2. Run: pnpm run dev"
echo "   3. Access your apps at the HTTPS URLs above"
echo ""
