# Mongo Citas - Gestión de Citas Médicas

Este repositorio ofrece una solución para gestionar y realizar peticiones controladas (GET) utilizando middleware para manejar diferentes tipos de datos, limitar la cantidad de datos y establecer un límite de peticiones por token.

## Guía de Uso

Sigue estos pasos para configurar y utilizar la aplicación:

### Paso 1: Clonar el Repositorio

Clona este repositorio en tu máquina local.

### Paso 2: Instalación

Asegúrate de tener Node.js instalado en tu sistema. Luego, instala las dependencias ejecutando el siguiente comando en la terminal:

``npm i``

### Paso 3: Configuración de Variables de Entorno

1. Copia el archivo `.env.example` y renómbralo como `.env`.
2. En el archivo `.env`, configura las siguientes variables de entorno:

```My_server={
My_server={"hostname":"127.10.10.10", "port":"5000"}
ATLAS_USER="nombreusuario"
ATLAS_PASSWORD="contraseña"
ATLAS_DB="Citas"
```

### Paso 4: Conexión a la Base de Datos

1. Instala la extensión **MongoDB for VS Code** en Visual Studio Code si aún no lo has hecho.
2. Abre la extensión y selecciona "Connect" en la parte superior izquierda.
3. Ingresa el link de conexión de la base de datos, el cual puedes encontrar en tu cuenta de Atlas. El formato es similar a:

```
mongodb+srv://nombreusuario:<password>@cluster0.cof7srf.mongodb.net/

```

4. Una vez conectado, ejecuta el archivo `db/base_datos.mongodb` haciendo clic en el icono de "Mongo Run" en la esquina superior derecha.

### Paso 5: Ejecutar el Servidor

En la terminal, ejecuta el siguiente comando para iniciar el servidor:

`npm run dev`

El servidor se ejecutará en un puerto que se mostrará en la terminal.

### Paso 6: Realizar Peticiones

## Url

1. Obtener todos los pacientes alfabéticamente = http://127.10.10.10:5060/pacientes
2. Obtener todas las citas alfabéticamente = http://127.10.10.10:5060/cita
3. Obtener todos los médicos de una especialidad específica (por ejemplo,  **'Cardiología'** )=http://127.10.10.10:5060/medico/especialidad/Pediatría
4. Encontrar la próxima cita para un paciente específico (por ejemplo, el paciente con  **usu_id 1** )=http://127.10.10.10:5060/cita/1
5. Encontrar todos los pacientes que tienen citas con un médico específico (por ejemplo, el médico con  **med_nroMatriculaProsional 1** )=http://127.10.10.10:5060/pacientes/12345
6. Obtener las consultorías para un paciente específico (por ejemplo, paciente  **con usu_id 1** )=http://127.10.10.10:5060/pacientes/consultorias/1
7. Encontrar todas las citas para un día específico (por ejemplo,  **'2023-07-12'** )=http://127.10.10.10:5060/cita/fecha/2023-08-25
8. Obtener los médicos y sus consultorios **=**http://127.10.10.10:5060/medico/consultorios
9. Contar el número de citas que un médico tiene en un día específico http://127.10.10.10:5060/medico/citas/12345/2023-08-25
10. Obtener los consultorio donde se aplicó las citas de un pacientehttp://127.10.10.10:5060/pacientes/consultorios/1
11. Obtener todas las citas realizadas por los pacientes de un genero si su estado de la cita fue atendidad **=**http://127.10.10.10:5060/cita/citasGenero/1/estado/Pendiente
12. Mostrar todas las citas que fueron rechazadas y en un mes específico, mostrar la fecha de la cita, el nombre del usuario y el médico.=http://127.10.10.10:5060/cita/citasRechazadas/Rechazada/12
