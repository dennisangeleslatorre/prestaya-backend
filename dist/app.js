"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const jwt_strategy_1 = __importDefault(require("./utils/strategies/jwt.strategy"));
var cors = require('cors');
// Routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const role_routes_1 = __importDefault(require("./routes/role.routes"));
const compania_routes_1 = __importDefault(require("./routes/compania.routes"));
const agencia_routes_1 = __importDefault(require("./routes/agencia.routes"));
const pais_routes_1 = __importDefault(require("./routes/pais.routes"));
const departamento_routes_1 = __importDefault(require("./routes/departamento.routes"));
const provincia_routes_1 = __importDefault(require("./routes/provincia.routes"));
const distrito_routes_1 = __importDefault(require("./routes/distrito.routes"));
const tipoDocumento_routes_1 = __importDefault(require("./routes/tipoDocumento.routes"));
const tipoProducto_routes_1 = __importDefault(require("./routes/tipoProducto.routes"));
const unidadMedida_routes_1 = __importDefault(require("./routes/unidadMedida.routes"));
const parametros_routes_1 = __importDefault(require("./routes/parametros.routes"));
const periodos_routes_1 = __importDefault(require("./routes/periodos.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
class App {
    //Quiere decir qye lo que recibes puede ser tipo numero o string
    //El signo de pregunta dice que puede o no puede llegar una propiedad
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.app.use(cors());
        (0, dotenv_1.config)();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        console.log(process.env.PORT);
        this.app.set('port', this.port || process.env.PORT || 3000);
    }
    middlewares() {
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json());
        this.app.use(passport_1.default.initialize());
        passport_1.default.use(jwt_strategy_1.default);
    }
    routes() {
        this.app.use('/user', user_routes_1.default);
        this.app.use('/role', role_routes_1.default);
        this.app.use('/compania', compania_routes_1.default);
        this.app.use('/agencia', agencia_routes_1.default);
        this.app.use('/pais', pais_routes_1.default);
        this.app.use('/departamento', departamento_routes_1.default);
        this.app.use('/provincia', provincia_routes_1.default);
        this.app.use('/distrito', distrito_routes_1.default);
        this.app.use('/tipodocumento', tipoDocumento_routes_1.default);
        this.app.use('/tipoproducto', tipoProducto_routes_1.default);
        this.app.use('/unidadmedida', unidadMedida_routes_1.default);
        this.app.use('/parametros', parametros_routes_1.default);
        this.app.use('/periodos', periodos_routes_1.default);
        this.app.use('/cliente', cliente_routes_1.default);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.app.get('port'));
            console.log('App listening port', this.app.get('port'));
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map