const cassandra = require('cassandra-driver');

module.exports = new cassandra.Client({
    contactPoints: ['203.250.77.156'],
    localDataCenter: 'datacenter1',
    keyspace: 'wallet_keyspace',
    socketOptions: {
        readTimeout: 0,
        connectTimeout: 10000000
    }
})