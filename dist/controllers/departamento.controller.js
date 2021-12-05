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
exports.getDepartamentosAdmin = exports.getDepartamentos = void 0;
const database_1 = require("../database");
function getDepartamentos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const departamento = body;
            if (departamento.c_paiscodigo) {
                const conn = yield (0, database_1.connect)();
                const [rows, fields] = yield conn.query('SELECT * FROM MA_DEPARTAMENTO where c_estado="A" AND c_paiscodigo=?', [departamento.c_paiscodigo]);
                yield conn.end();
                const departamentosRes = rows;
                if (!departamentosRes) {
                    return res.status(200).json({ data: [], message: "No se encontró departamentos" });
                }
                return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
            }
            return res.status(200).json({ message: "Se debe enviar el pais para listar los departamentos" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getDepartamentos = getDepartamentos;
function getDepartamentosAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_DEPARTAMENTO');
            yield conn.end();
            const departamentosRes = rows;
            if (!departamentosRes) {
                return res.status(200).json({ data: [], message: "No se encontró departamentos" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getDepartamentosAdmin = getDepartamentosAdmin;
/*
export async function registerDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const departamento: Departamento = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_DEPARTAMENTO SET ?', [departamento]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: departamento, message: "Se registró el departamento con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_paiscodigo = body.c_paiscodigo;
        const c_departamentocodigo = body.c_departamentocodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const departamento: Departamento = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_DEPARTAMENTO SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo', [departamento, c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...departamento}, message: "Se actualizó el departamento con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getDepartamentoByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.query.c_paiscodigo;
        const c_departamentocodigo = req.query.c_departamentocodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_DEPARTAMENTO WHERE c_paiscodigo = ? AND c_departamentocodigo', [c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        const departamentoRes = data[0] as [Departamento];
        if(!departamentoRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el departamento" });
        }
        return res.status(200).json({ success:true, data: departamentoRes[0], message: "Se obtuvo el departamento con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/ 
//# sourceMappingURL=departamento.controller.js.map