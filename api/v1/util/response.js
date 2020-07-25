var winston = require('./winston');


function Response(res) {
    this.res = res;
}

Response.prototype.json = function(status, body) {
    if (status !== 200) {
        winston.info(body.message);
    }
    this.res.status(status).json(body);

    
}

module.exports = Response;