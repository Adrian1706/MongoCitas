import { conexion } from "../db/atlas.js";
import { Router } from "express";

const appUsuario = Router();

let db = await conexion();

let Usuario = db.collection('usuario');

appUsuario.get("/", async(req, res)=>{

    let db = await conexion();
    let Usuario = db.collection('usuario');
    let result = await Usuario.find({}).sort({usu_nombre:1}).toArray();
    res.send(result);

});

export default appUsuario;