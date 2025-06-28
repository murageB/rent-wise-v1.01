#!/bin/bash

APP_DIR="/home/murage/RentWise v1.01/rent-wise-app/v1.01/rent_wise"
PORT=3001

# Switch to the Rails app directory
echo "Switching to Rails app directory: $APP_DIR"
cd "$APP_DIR" || { echo "Directory not found: $APP_DIR"; exit 1; }

# Check for processes using the port
PID=$(lsof -ti tcp:$PORT)
if [ -n "$PID" ]; then
  echo "Killing process $PID using port $PORT..."
  kill -9 $PID
fi

# Start the Rails server
echo "Starting Rails server on port $PORT..."
bundle exec rails server -b 0.0.0.0 -p $PORT

echo "If you see 'Listening on http://0.0.0.0:$PORT', open http://localhost:$PORT in your browser." 