import express, { Application } from 'express'
import {config as envConfig} from 'dotenv'
import morgan from 'morgan'
import passport from 'passport'
import JWTStrategy from './utils/strategies/jwt.strategy'
var cors = require('cors')




// Routes
import UserRoute from './routes/user.routes'
import RoleRoute from './routes/role.routes'
import CompaniaRoute from './routes/compania.routes'
import AgenciaRoute from './routes/agencia.routes'
import PaisRoute from './routes/pais.routes'
import DepartamentoRoute from './routes/departamento.routes'
import ProvinciaRoute from './routes/provincia.routes'
import DistritoRoute from './routes/distrito.routes'
import TipoDocumentoRoute from './routes/tipoDocumento.routes'
import TipoProductoRoute from './routes/tipoProducto.routes'
import UnidadMedidaRoute from './routes/unidadMedida.routes'
import Parametros from './routes/parametros.routes'
import Cliente from './routes/cliente.routes'


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
        this.app.use(passport.initialize());
        passport.use(JWTStrategy);
    }

    routes() {
        this.app.use('/user', UserRoute);
        this.app.use('/role', RoleRoute);
        this.app.use('/compania', CompaniaRoute);
        this.app.use('/agencia', AgenciaRoute);
        this.app.use('/pais', PaisRoute);
        this.app.use('/departamento', DepartamentoRoute);
        this.app.use('/provincia', ProvinciaRoute);
        this.app.use('/distrito', DistritoRoute);
        this.app.use('/tipodocumento', TipoDocumentoRoute);
        this.app.use('/tipoproducto', TipoProductoRoute);
        this.app.use('/unidadmedida', UnidadMedidaRoute);
        this.app.use('/parametros', Parametros);
        this.app.use('/cliente', Cliente);
    }

  

    async listen() {
        await this.app.listen(this.app.get('port'))
        console.log('App listening port', this.app.get('port'))
    }
}