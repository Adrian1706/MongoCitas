import { conexion } from "../db/atlas.js";
import { Router } from "express";
import { limitGrt } from "../limit/config.js";

const appMedico = Router();

let db = await conexion();

let Medico = db.collection('medico');

appMedico.get("/especialidad/:esp_nombre", limitGrt(), async(req, res)=>{
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const esp_nombre = req.params.esp_nombre;

    let db = await conexion();
    let Medico = db.collection('medico');
    let result = await Medico.find({"med_especialidad.esp_nombre": esp_nombre}).toArray();
    res.send(result);

});

appMedico.get("/consultorios", limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
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

appMedico.get("/citas/:med_nroMatriculaProfesional/:fecha", limitGrt(), async (req, res) => {
    if(!req.rateLimit) return; 
    console.log(req.rateLimit);
    const med_nroMatriculaProfesional = parseInt(req.params.med_nroMatriculaProfesional);
    const fecha = new Date(req.params.fecha);

    try {
        let cita = db.collection('cita');
        
        let result = await cita.aggregate([
            {
                $match: {
                    cit_medico: med_nroMatriculaProfesional,
                    cit_fecha: fecha
                }
            },
            {
                $group: {
                    _id: "$cit_medico",
                    totalCitas: { $sum: 1 }
                }
            }
        ]).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
    }
});

export default appMedico;