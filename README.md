# 🏪 Proyecto UTU - SaborUY

## 📌 Descripción general

SaborUY es una aplicación web que permite registrar, administrar y visualizar tiendas o locales comerciales.  
Los usuarios pueden dejar reseñas, puntuarlas con estrellas y subir imágenes de los locales.

El objetivo del sistema es ofrecer una plataforma práctica para aprender sobre **desarrollo web full stack**, **manejo de bases de datos** y **diseño responsive**.

---

## 💻 Tecnologías utilizadas

### Frontend

- React + Vite
- Tailwind CSS + DaisyUI
- React Router

### Backend

- PHP con PDO
- Composer (gestor de dependencias)
- Servidor local XAMPP
- MySQL

---

## 📂 Estructura del proyecto

proyecto-utu/
├── backend/
│ ├── routes/ -> Endpoints del servidor
│ ├── vendor/ -> Librerías instaladas con Composer
│ ├── config.php -> Configuración de la conexión a la base de datos
│ ├── index.php -> Punto de entrada del backend
│ ├── composer.json -> Dependencias PHP
│ └── composer.lock -> Control de versiones de librerías
│
├── frontend/
│ ├── src/ -> Componentes React y vistas
│ ├── public/ -> Archivos públicos
│ └── package.json -> Dependencias del frontend
│
├── uploads/ -> Carpeta donde se guardan imágenes de usuarios y tiendas
└── README.md -> Documentación del proyecto

/uploads -> Carpeta donde se guardan imágenes de usuarios y tiendas

README.md -> Documentación del proyecto

## 🛠️ Instalación y configuración

1. Clonar el repositorio:
   git clone https://github.com/Ago-2020/proyecto-utu.git

2. Iniciar el servidor local con XAMPP (Apache y MySQL).

3. Importar la base de datos:

   - Abrir phpMyAdmin
   - Crear una base de datos (nombre: proyecto_utu)
   - Importar el archivo /database/proyecto_utu.sql

4. Configurar la conexión en:
   backend/config.php
   (actualizar usuario, contraseña y nombre de la base de datos)

5. Iniciar el backend:
   cd backend
   composer install
   php -S localhost:8000 index.php

6. Iniciar el frontend:
   cd frontend
   pnpm install
   pnpm dev

7. Acceder al sistema:
   Abrir el navegador y entrar al frontend (ej: http://localhost:5173)

## Autores

- Ago-2020 - Desarrollador Full Stack y documentación
- iTxkeshi - Desarrollador UI/UX
- GabiDem - Encargado de la Base de Datos
