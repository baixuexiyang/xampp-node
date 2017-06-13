var main = require('./routes/index');
module.exports = function (app) {
    'use strict';
    app.get('/', main.listFiles);
    app.get(/\/([\w\W\-\_]+)(\.[shtml|html|htm|php|jade])?/i, main.getHtml);
    app.get('/*', main.listFiles);
    app.post('/*', main.sendJson);
    app.use(function (req, res, next) {
        var err = new Error ('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        if (req.xhr) {
            res.status(err.status || 404).set('Content-type', 'application/json');
            res.send({
                status: err.status || 404,
                code: 1,
                message: err.message || 'Not Found'
            });
        } else {
            res.status(err.status || 404).set('Content-type', 'text/html');
            res.render('views/main/error.html', {
                status: err.status || 404,
                message: err.message || 'Not Found'
            });
        }
    });
};
