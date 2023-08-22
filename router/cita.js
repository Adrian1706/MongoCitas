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

export default appCita;