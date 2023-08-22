import dotenv from 'dotenv';
import express from 'express';
import appUsuario from './router/usuario.js';
import appCita from './router/cita.js';

dotenv.config();

let app = express();

app.use(express.json());
app.use("/pacientes", appUsuario);
app.use("/cita", appCita)

let config = JSON.parse(process.env.MY_SERVER);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});