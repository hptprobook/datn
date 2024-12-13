#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 redis 6379
do
  echo "Waiting for Redis connection..."
  sleep 1
done

echo "Redis is up - executing command"
exec $cmd 