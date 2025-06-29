#!/usr/bin/env bash

PORT=3000
RAILS_ENV=development

# Find and kill any process using the specified port (default: 3000)
echo "[1/4] Killing any process running on port $PORT..."
PID=$(lsof -ti tcp:$PORT)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "Killed process $PID on port $PORT."
else
  echo "No process running on port $PORT."
fi

# Run bundle install
echo "[2/4] Running bundle install..."
bundle install

# Start Rails server in the background
echo "[3/4] Starting Rails server on port $PORT..."
nohup rails server -p $PORT -e $RAILS_ENV > log/rails_server.log 2>&1 &
RAILS_PID=$!
sleep 5

# Test if server is up
echo "[4/4] Testing server at http://localhost:$PORT..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
  echo "Rails server is running and responded with HTTP $HTTP_CODE."
else
  echo "Rails server did not respond as expected. HTTP code: $HTTP_CODE. Check log/rails_server.log for details."
fi

echo "Done." 