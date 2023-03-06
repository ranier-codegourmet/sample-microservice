#!/bin/bash

echo "Starting replica set initialize"
until mongo --host mongo1 --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished"
echo "Creating replica set"
mongo --host mongo1 <<EOF
var cfg =   {
    _id : 'rs0',
    protocolVersion: 1,
    members: [
      { _id : 0, host : "mongo1:27017", priority: 1 },
    ]
  }
rs.initiate(cfg, { force: true })
rs.reconfig(cfg, { force: true })
db.getMongo().setReadPref('nearest');
EOF
echo "replica set created"
