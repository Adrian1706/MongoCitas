import { SignJWT, jwtVerify } from "jose";
import { conexion } from "../db/atlas.js";
import dotenv from 'dotenv';
dotenv.config();

const conexionDB = await conexion();


const crearToken = async (req, res) => {
    const encoder = new TextEncoder();
    const roles = {
        medico: ["cita", "medico"],
        usuario: ["cita", "usuario"],
        administrador: ["cita", "usuario", "medico"]
    };

    const rol = req.params.rol;
    if (!roles[rol]) {
        return res.status(400).json({ mensaje: "Rol no encontrado" });
    }

    const jwtConstructor = await new SignJWT({ rol: rol }) 
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
    res.send(jwtConstructor);
}


const validarToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );

        
        const rol = jwtData.payload.rol;
        console.log("Rol obtenido:", rol); 

        
        const urlParts = req.url.split("/");
        console.log("partes url:", urlParts[1]);
        
        let coleccionIndex = urlParts.findIndex(part => part === "cita" || part === "medico" || part === "usuario");

        if (coleccionIndex === -1) {
            return res.status(400).json({ mensaje: "Colección no encontrada en la URL" });
        }
        const coleccion = urlParts[coleccionIndex];

        console.log("Colección obtenida:", coleccion); 
        
        const rolesData = await conexionDB.collection('roles').findOne({ nombre_rol: rol });

        if (!rolesData) {
            return res.status(401).json({ mensaje: "Rol no encontrado" });
        }

        const accesoColecciones = rolesData.acceso_rol;

        if (accesoColecciones.some(acceso => acceso === coleccion)) {
            next();
        } else {
            return res.status(403).json({ mensaje: "Acceso no autorizado a la colección" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ mensaje: "Token inválido" });
    }
}

export {
    crearToken,
    validarToken
}