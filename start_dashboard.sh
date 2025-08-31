#!/bin/bash

echo "🚀 Starting Merchants Dashboard"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Set environment variables
export REACT_APP_API_URL="https://merchants.globpay.ai"
export PORT=3000

echo "🔧 Environment configured:"
echo "   API URL: $REACT_APP_API_URL"
echo "   Dashboard Port: $PORT"
echo "   Backend API: https://merchants.globpay.ai"

echo ""
echo "🎯 Starting Dashboard..."
echo "   The dashboard will be available at: http://localhost:$PORT"
echo "   All API requests will be proxied to: https://merchants.globpay.ai"
echo ""
echo "📱 Login credentials:"
echo "   Contact your system administrator for login credentials"
echo ""
echo "⚠️  Make sure the backend API is running on merchants.globpay.ai"
echo ""

# Start the development server
npm start
