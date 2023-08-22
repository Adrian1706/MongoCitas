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

appCita.get("/proxima-cita/:usu_id", async(req, res)=>{

    const usu_id = req.params.usu_id;

    let db = await conexion();
    let Cita = db.collection('cita');
    let result = await Cita.findOne({ cit_datosUsuario: usu_id, cit_estadoCita: { est_cita_id: 1, est_cita_nombre: "Pendiente" } },
    { sort: { cit_fecha: 1 } });
    res.send(result);
})

export default appCita;