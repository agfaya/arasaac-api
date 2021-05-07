'use strict';

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const app = require('./app');
const config = require('./config');
const logger = require('./services/logger');
const cluster = require('cluster');

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(config.db, opts);

mongoose.connection.on('connected', function(){
    logger.info('Successful database connection');
});

mongoose.connection.on('error', function(err){
    logger.error(`Error establishing a database connection: ${err}`);
});

mongoose.connection.on('disconnected', function () {
    logger.error('Database disconnected');
});

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        logger.info('Arasaac API stopped');
        process.exit(0)
    });
});

if (cluster.isMaster) {
    const cpuCount = require('os').cpus();
    cpuCount.forEach((cpu) => {
        cluster.fork(); // fork web server
    });
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork(); // on dying worker, respawn
    });
} else {
    app.listen(config.port, () => {
        logger.info(`Arasaac API REST running in http://localhost:${config.port}`);
    })
}

