import { conexion } from "../db/atlas.js";
import { Router } from "express";

const appCita = Router();

let db = await conexion();

let Cita = db.collection('cita');

appCita.get("/", async(req, res)=>{

    let db = await conexion();
    let Cita = db.collection('cita');
    let result = await Cita.find({}).sort({cit_codigo:1}).toArray();
    res.send(result);

});

appCita.get("/:usu_id", async (req, res) => {

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


export default appCita;