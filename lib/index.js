import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
//-----------------------------------------------
import Logger from './helpers/winston-logger';
import routes from './routes/index';

//using let
const logger = new Logger();
const app = express();

/*
 * Sample way to use winston info and error logger. Info logger comes below error access level so it will have all your information + errors.
 * { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
 * @private
 */
logger.error('errorlog', 'Hello Error');
logger.info('Hello Info', {
    anything: 'this is metdata'
});


// General Express and Node API Settings - configure CORS for local dev
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
});
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//Settings END

app.use('/', routes);


// using arrow syntax for general API not found
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;
// arrow functions
const server = app.listen(3000, () => {
    // destructuring
    const {
        address,
        port
    } = server.address();

    // string interpolation:
    console.log(`Example app listening at http://${address}:${port}`);
});
