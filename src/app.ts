import express, { Application } from 'express'
import {config as envConfig} from 'dotenv'
import morgan from 'morgan'
var cors = require('cors')

// Routes
import UserRoute from './routes/user.routes'
import RoleRoute from './routes/role.routes'

export class App {
    private app: Application

    //Quiere decir qye lo que recibes puede ser tipo numero o string
    //El signo de pregunta dice que puede o no puede llegar una propiedad
    constructor(private port?: number | string) {
        this.app = express();
        this.app.use(cors());
        envConfig();
        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        console.log(process.env.PORT)
        this.app.set('port', this.port || process.env.PORT || 3000)
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/user', UserRoute);
        this.app.use('/role', RoleRoute);
    }

    async listen() {
        await this.app.listen(this.app.get('port'))
        console.log('App listening port', this.app.get('port'))
    }
}