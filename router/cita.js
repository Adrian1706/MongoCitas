import { conexion } from "../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../limit/config.js";

const appCita = Router();

let db = await conexion();

let Cita = db.collection('cita');

appCita.get("/", limitGrt(), async(req, res)=>{
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    let db = await conexion();
    let Cita = db.collection('cita');
    let result = await Cita.find({}).sort({cit_codigo:1}).toArray();
    res.send(result);

});

appCita.get("/:usu_id", limitGrt(), async(req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const usu_id = parseInt(req.params.usu_id); 

    try {
        let db = await conexion();
        let Cita = db.collection('cita');
        
        let now = new Date();
        let result = await Cita.find({
            "cit_datosUsuario": usu_id,
            "cit_fecha": { $gte: now }
        }).sort({ "cit_fecha": 1 }).limit(1).toArray();

        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send("No se encontraron citas futuras para el paciente.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrió un error al obtener la próxima cita.");
    }

});

appCita.get("/fecha/:fecha", limitGrt(), async(req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const fecha = new Date(req.params.fecha);

    const Cita = db.collection('cita');
    
    const citasEnFecha = await Cita.find({
        "cit_fecha": fecha
    }).toArray();

    res.send(citasEnFecha);
});

appCita.get("/citasGenero/:gen_id/estado/:estado", limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    /** http://127.0.0.1:5060/cita/citasGenero/1/estado/Pendiente */

    const gen_id = parseInt(req.params.gen_id);
    const estado = req.params.estado;

    try {
        let cita = db.collection('cita');
        
        let result = await cita.aggregate([
            {
                $lookup: {
                    from: "usuario",
                    localField: "cit_datosUsuario",
                    foreignField: "usu_id",
                    as: "usuario"
                }
            },
            {
                $match: {
                    "usuario.usu_genero.gen_id": gen_id,
                    "cit_estadoCita.est_cita_nombre": estado
                }
            },
            {
                $project: {
                    _id: 0,
                    cit_codigo: 1,
                    cit_fecha: 1,
                    cit_estadoCita: 1,
                    cit_medico: 1,
                    cit_datosUsuario: 1
                }
            }
        ]).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
 
});

appCita.get("/citasRechazadas/:estado/:mes", limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    /** http://127.0.0.1:5060/cita/citasRechazadas/Rechazada/12 */

    const estado = req.params.estado;
    const mes = parseInt(req.params.mes);

    try {
        let db = await conexion();
        let cita = db.collection('cita');
        
        let result = await cita.aggregate([
            {
                $lookup: {
                    from: "usuario",
                    localField: "cit_datosUsuario",
                    foreignField: "usu_id",
                    as: "usuario"
                }
            },
            {
                $lookup: {
                    from: "medico",
                    localField: "cit_medico",
                    foreignField: "med_nroMatriculaProfesional",
                    as: "medico"
                }
            },
            {
                $match: {
                    "cit_estadoCita.est_cita_nombre": estado,
                    "cit_fecha": {
                        $gte: new Date(2023, mes - 1, 1),
                        $lt: new Date(2023, mes, 1)
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    cit_fecha: 1,
                    usuario: { $arrayElemAt: ["$usuario.usu_nombre", 0] },
                    medico: { $arrayElemAt: ["$medico.med_nombreCompleto", 0] }
                }
            }
        ]).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default appCita;