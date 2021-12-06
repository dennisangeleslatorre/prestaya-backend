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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompaniaAdmin = exports.getCompania = void 0;
const database_1 = require("../database");
function getCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_compania,c_descricpion,c_ruc,c_direccion,c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_distritocodigo FROM  MA_COMPANIA where c_estado="A"');
            yield conn.end();
            const tipoCompaniaRes = rows;
            if (!tipoCompaniaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró compañía" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompania = getCompania;
function getCompaniaAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_COMPANIA');
            yield conn.end();
            const TipoCompaniaRes = rows;
            if (!TipoCompaniaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró compañía" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompaniaAdmin = getCompaniaAdmin;
/*
export async function registerCompania(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const compania: Compania = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: compania, message: "Se registró la compañía con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateCompania(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_compania = req.params.c_compania;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const compania: Compania = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_COMPANIA SET ? WHERE c_compania = ?', [compania, c_compania]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...compania}, message: "Se actualizó la compañía con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una compañía con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getCompaniaByCCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_compania;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
        await conn.end();
        const companiaRes = data[0] as [Compania];
        if(!companiaRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró la compañía" });
        }
        return res.status(200).json({ success:true, data: companiaRes[0], message: "Se obtuvo la compañía con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/ 
//# sourceMappingURL=compania.controller.js.map