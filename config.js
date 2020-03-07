'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27018,localhost:27017/arasaacdb?replicaSet=rs0&readPreference=secondaryPreferred',
    SECRET_TOKEN: 'arasaac-api'
};