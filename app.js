import dotenv from 'dotenv';
import express from 'express';
import appUsuario from './router/usuario.js';
import appCita from './router/cita.js';
import appMedico from './router/medico.js';

dotenv.config();

let app = express();

app.use(express.json());
app.use("/pacientes", appUsuario);
app.use("/cita", appCita);
app.use("/medico", appMedico);

let config = JSON.parse(process.env.MY_SERVER);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});