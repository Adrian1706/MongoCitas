import { conexion } from "../db/atlas.js";
import { Router } from "express";

const appMedico = Router();

let db = await conexion();

let Medico = db.collection('medico');

appMedico.get("/:esp_nombre", async(req, res)=>{

    const esp_nombre = req.params.esp_nombre;

    let db = await conexion();
    let Medico = db.collection('medico');
    let result = await Medico.find({"med_especialidad.esp_nombre": esp_nombre}).toArray();
    res.send(result);

});

export default appMedico;