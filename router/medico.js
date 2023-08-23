import { conexion } from "../db/atlas.js";
import { Router } from "express";

const appMedico = Router();

let db = await conexion();

let Medico = db.collection('medico');

appMedico.get("/especialidad/:esp_nombre", async(req, res)=>{

    const esp_nombre = req.params.esp_nombre;

    let db = await conexion();
    let Medico = db.collection('medico');
    let result = await Medico.find({"med_especialidad.esp_nombre": esp_nombre}).toArray();
    res.send(result);

});

appMedico.get("/consultorios", async (req, res) => {

    let db = await conexion();
      let medico = db.collection("medico");
  
      let result = await medico
        .find()
        .project({
          _id: 0,
          med_nombreCompleto: 1,
          "med_consultorio.cons_nombre": 1,
        })
        .toArray();
      res.send(result);
      
});
export default appMedico;