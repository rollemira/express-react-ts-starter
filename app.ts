import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as config from 'config';
import * as mongoose from 'mongoose';

//routes
import {TodoRoutes} from './routes/todo';

export class ExpressServer {
    public app: express.Application;
    public env: String = process.env.NODE_ENV || 'development';

    constructor() {
        this.app = express();
        let router: express.Router = express.Router();
        this.configure();
        this.api(router);
        this.client(router);
    }

    public static bootstrap(): ExpressServer {
        return new ExpressServer();
    }

    public api(router: express.Router) {
        //custom api routes
        TodoRoutes(router);

        //under /api segment
        this.app.use('/api', router);
    }

    public client(router: express.Router) {
        //let client do routing
        router.get('*', (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });
    }

    public configure() {
        if (config.get('server.development')) {
            this.app.use(cors());
            //noinspection TypeScriptValidateTypes
            this.app.use(logger('dev'));
        }
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));

        //use q promises
        global.Promise = require('q').Promise;
        mongoose.Promise = global.Promise;

        //connect to mongoose
        const connection = config.get('database.connection');
        mongoose.connect(connection);
        mongoose.connection.on('connected', () => {
            if (config.get('server.development'))
                console.log('Connected to database ' + connection);
        });
        mongoose.connection.on('error', (err) => {
            console.log('Database error ' + err);
        });

        // catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
           err.status = 404;
           next(err);
        });

        // error handler
        this.app.use((err, req, res, next) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            //noinspection TypeScriptValidateJSTypes
            res.locals.error = (config.get('server.development')) ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
}