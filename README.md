# Plataforma ConectaUBB
## Repositorio dedicado al codigo para la plataforma de gestion de agrupaciones estudiantiles de la Universidad del Bío-Bío sede concepción
### Instrucciones para montar la plataforma web:
## Requisitos:
    - Instalación de NodeJS version 20.14.0
    - Instalación de PM2 version 5.4.2 o superior
    - Instalación de git version 2.34.1 o superior
## Instalación:
    - Clonar el repositorio en una carpeta vacia
    - Navegar hasta el directoro /AgrupacionesUBB/backend/src/config y crear un archivo .env para manejar las variables de entorno para el Backend
    - Navegar hasta el directorio /AgrupacionesUBB/frontend y crear un archivo .env para manejar las variables de entorno para el Frontend
## Configuración .env Backend:
### Para la configuración de las variables de entorno del Backend de la plataforma se esperan las siguiente variables:
    ### // Puerto de escucha para Backend
    - FastifyPort = XXXX
    ### // Rango de direcciones IP para la plataforma (0.0.0.0 para todas las direcciones disponibles) 
    - FastifyHost = 'XXX.XXX.XXX.XXX'
    ### // Nombre de usuario para la base de datos
    - user = 'XXXXX'
    ### // Contraseña de la base de datos
    - password = 'XXXXX' 
    ### // Dirección IP o nombre de dominio del servidor con la base de datos
    - host 'XXX.XXX.XXX.XXX'
    ### // Puerto de escucha de la base de datos
    - portpg = XXXX
    ### // Nombre de la base de datos
    - database = 'XXXXXX'
    ### // Secreto para generar los tokens de acceso y autorización 
    - JWT_SECRET = XXXXXXXXXXXXXXX
    ### // Correo utilizado para enviar los correos automatizados de la plataforma (Requiere un correo que tenga habilitada una "Contraseña de aplicación") 
    - MAIL_USER = 'XXXXX@XXXX.XXX'
    ### // Contraseña de aplicación del correo (Puede ser habilitado desde la pestaña de "Cuenta" y buscar "Constraseñas de aplicaciones" (Requiere verificación de 2 factores activada))
    - MAIL_PASS = 'XXX XXX XXX XXX'
    ### // Secreto para generar las Cookies de la plataforma
    - COOKIE_SECRET = XXXXXXXXXXXXXX  
    ### // Direccion completa hacia la API de ConectaUBB para el enlace con la base de datos de estudiantes y docentes
    - API_URL = 'XXXX://XXX.XXX.XXX.XXX:XXXX/ConectaUBB/api'

## Configuración .env Frontend:
### Para la configuración de las variables de entorno del Frontend de la plataforma se esperan las siguiente variables:
    ### // Puerto de escucha para Frontend (Recomendado utilizar el 443)
    - VuePort = XXXX
    ### // Rango de direcciones IP para la plataforma (0.0.0.0 para todas las direcciones disponibles)
    - ViteHost = 'XXX.XXX.XXX.XXX'
    ### // Direccion IP o nombre de dominio hacia Backend de la plataforma (http o https + dirección IP + puerto backend)
    - BackendURL = 'XXXX://XXXXXXXX:XXXX'
## Dependencias y configuracion de PM2 (Omitir las primeras comillas de cada comando):
    - Navegar hasta el directiori /AgrupacionesUBB/backend/src y ejecutar el comando "npm install"
    - Navegar hasta el directorio /AgrupacionesUBB/frontend y ejecutar el comando "npm install"
    - Navegar hasta el directorio /AgrupacionesUBB/frontend y ejecutar el comando "npm run build"
    - Navegar hasta el directorio /AgrupacionesUBB/frontend y ejecutar el comando "pm2 start npm --name "Frontend" -- run dev"
    - Navegar hasta el directiori /AgrupacionesUBB/backend/src y ejecutar el comando "pm2 start main.js"
    - Guardar la configuración de pm2 con el comando "pm2 save"

## Para la instalación de la API de la plataforma consultar el siguiente repositorio:
# https://github.com/ProZero133/ConectaUBB-API

    
