import { Request, Response } from 'express'
import { connect } from '../database'
import { SubtipoProducto } from '../interfaces//subtipoProducto.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getSubtipoProducto(req: Request, res: Response): Promise<Response> {
  try {
      const conn = await connect();
      const [rows, fields] = await conn.query('SELECT * FROM ma_subtipoproducto where c_estado="A"')
      await conn.end();
      const subtipoProductoRes =rows as [SubtipoProducto];
      if(!subtipoProductoRes[0]) {
          return res.status(200).json({ data:[], message: "No se encontró subtipos de productos." });
      }
      return res.status(200).json({ data:rows, message: "Se obtuvo registros." });
  } catch (error) {
      console.error(error)
      return res.status(500).send(error)
  }
}

export async function getSubtipoProductoAdmin(req: Request, res: Response) {
  try {
      const conn = await connect();
      const [rows, fields] = await conn.query('SELECT * FROM ma_subtipoproducto');
      await conn.end();
      const subtipoProductoRes = rows as [SubtipoProducto];
      if(!subtipoProductoRes[0]) {
          return res.status(200).json({ success: false, data:[], message: "No se encontró subtipos de producto." });
      }
      return res.status(200).json({ success: true, data:rows, message: "Se obtuvo subtipos de productos." });
  } catch (error) {
      console.error(error)
      return res.status(500).send(error)
  }
}

export async function getSubtipoByTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipoproducto = req.params.c_tipoproducto;
        if (c_tipoproducto) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_subtipoproducto where c_tipoproducto=?',
            [c_tipoproducto])
            await conn.end();
            const subtipoProductoRes = rows as [SubtipoProducto];
            if(!subtipoProductoRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró el subtipo de producto." });
            }
            return res.status(200).json({ data:subtipoProductoRes, message: "Se obtuvo registros." });
        }
        return res.status(503).json({ message: "Se debe enviar el código para listar la información del subtipo de producto." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function registerSubtipoProducto(req: Request, res: Response): Promise<Response> {
  try {
      const body = req.body;
      if(body.c_usuarioregistro) {
          body.c_ultimousuario = body.c_usuarioregistro;
          body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
          body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
          if( body.c_tipoproducto && body.c_subtipoproducto && body.c_descripcion &&
              body.c_estado && body.n_porcremate && body.n_porcvtatienda ) {
              const subtipoProducto: SubtipoProducto = body;
              const conn = await connect();
              const data = await conn.query('INSERT INTO ma_subtipoproducto SET ?', [subtipoProducto]);
              await conn.end();
              const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
              return res.status(200).json({ success: true, data: subtipoProducto, message: "Se registró el subtipo de producto con éxito." });
          } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
      } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
  } catch (error) {
      console.error(error);
      const errorAux = JSON.parse(JSON.stringify(error));
      let message = "Hubo un error";
      if(errorAux.errno === 1062) message = "Existe un subtipo de producto con esos datos.";
      return res.status(500).send({error: error, message: message});
  }
}

export async function getSubtipoProductoByCodigoSubtipoProducto(req: Request, res: Response): Promise<Response> {
  try {
      const c_tipoproducto = req.body.c_tipoproducto;
      const c_subtipoproducto = req.body.c_subtipoproducto;
      if( c_tipoproducto && c_subtipoproducto ) {
          const conn = await connect();
          const [rows, fields] = await conn.query('SELECT * FROM ma_subtipoproducto where c_tipoproducto=? AND c_subtipoproducto=?',
          [c_tipoproducto, c_subtipoproducto])
          await conn.end();
          const subtipoProductoRes =rows as [SubtipoProducto];
          if(!subtipoProductoRes[0]) {
              return res.status(200).json({ data:[], message: "No se encontró el subtipo de producto." });
          }
          return res.status(200).json({ data:subtipoProductoRes[0], message: "Se obtuvo registros." });
      }
      return res.status(200).json({ message: "Se debe enviar el código para listar la información del subtipo de producto." });
  } catch (error) {
      console.error(error)
      return res.status(500).send(error);
  }
}

export async function updateSubtipoProducto(req: Request, res: Response): Promise<Response> {
  try {
      //Obtener datos
      const c_tipoproducto = req.body.c_tipoproducto;
      const c_subtipoproducto = req.body.c_subtipoproducto;
      const body = req.body;
      if(body.c_ultimousuario) {
          body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
          const subtipoProducto: SubtipoProducto = req.body;
          const conn = await connect();
          await conn.query('UPDATE ma_subtipoproducto SET ? WHERE c_tipoproducto=? AND c_subtipoproducto=?',
          [subtipoProducto, c_tipoproducto, c_subtipoproducto]);
          await conn.end();
          return res.status(200).json({ data: {...subtipoProducto}, message: "Se actualizó el subtipo de producto con éxito"  });
      }
      return res.status(500).json({message: "No se está enviando el usuario que realiza la actualización." });
  } catch (error) {
      console.error(error);
      const errorAux = JSON.parse(JSON.stringify(error));
      let message = "Hubo un error.";
      if(errorAux.errno === 1062) message = "Existe un subtipo de producto con esos datos";
      return res.status(500).send({error: error, message: message});
  }
}

export async function deleteSubtipoProducto(req: Request, res: Response): Promise<Response> {
  try {
      const c_tipoproducto = req.body.c_tipoproducto;
      const c_subtipoproducto = req.body.c_subtipoproducto;
      if(c_tipoproducto && c_subtipoproducto) {
          const conn = await connect();
          await conn.query('DELETE FROM ma_subtipoproducto WHERE c_tipoproducto = ? AND c_subtipoproducto = ?', [c_tipoproducto, c_subtipoproducto]);
          await conn.end();
          return res.status(200).json({ message: "Se eliminó el subtipo de producto con éxito"  });
      }return res.status(400).json({ message: "Se debe enviar el código del subtipo de producto"  });
  } catch (error) {
      console.error(error);
      const errorAux = JSON.parse(JSON.stringify(error));
      let message = "Hubo un error.";
      if(errorAux.errno === 1217) message = "No se puede eliminar el subtipo de producto debido a que tiene datos asociados";
      return res.status(500).send({error: error, message: message});
  }
}