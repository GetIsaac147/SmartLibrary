# SmartLibrary - Sistema de Gestión de Biblioteca Universitaria

SmartLibrary es una aplicación web moderna diseñada para la gestión de inventario de libros, control de préstamos y administración de usuarios. Desarrollado para la materia de Aplicaciones de Internet en la Universidad de Guanajuato, este proyecto utiliza una arquitectura de JavaScript Directo integrada con servicios de Firebase.

## Características Principales

* Autenticación Completa: Registro, inicio de sesión y cierre de sesión seguro mediante Firebase Auth.
* Gestión de Libros y Autores (CRUD): Control total sobre el catálogo de la biblioteca, incluyendo disponibilidad en tiempo real.
* Sistema de Préstamos: Registro de préstamos con cálculo automático de fecha de vencimiento (7 días).
* Notificaciones Automáticas: Integración con el SDK de EmailJS para enviar confirmaciones de préstamo vía Gmail al usuario.
* Dashboard Privado: Interfaz administrativa protegida para la gestión de datos.
* Diseño Responsivo: Interfaz optimizada para móviles y escritorio con Bootstrap.

## Tecnologías y Requerimientos

* Lenguaje: JavaScript (ES6+) sin frameworks (Vanilla JS).
* Estilos: HTML5, CSS3, Bootstrap 5.
* Backend (BaaS): Firebase (SDK v10.12.0).
    * Authentication: Manejo de usuarios.
    * Firestore Database: Almacenamiento de colecciones (users, books, loans).
* Servicio de Correo: EmailJS.

## Reglas de Seguridad (Firestore)

Se configuraron reglas de seguridad básicas para asegurar que solo usuarios autenticados puedan interactuar con la base de datos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Flujo de Trabajo (GitFlow)
El desarrollo se gestionó mediante Git, siguiendo una convención de ramas y commits semánticos:

Ramas: main, develop, feature/auth, feature/crud-principal.

Commits: Uso de prefijos como [ADDED], [FIXED], [UPDATED].

Configuración
Firebase: Reemplazar el objeto de configuración en js/firebase.js con tus credenciales de la consola de Firebase.

EmailJS: Configurar el Service ID, Template ID y Public Key en la función de préstamos dentro de js/loans.js.

Ejecución: Abrir index.html mediante un servidor local (ej. Live Server).

Acceso de Prueba
Rol Usuario Contraseña
Administrador admin@admin.coma dmin1234
Lector test@user.com user1234

Colaboradores
Sergio Eduardo Rodríguez Amézola - Registro y Autenticación.

Daniel Josafat Manrique Mejía - Sistema de Préstamos y EmailJS.

Isaac Prieto Hurtado - Catálogo de Libros y UI.

Fernando Luna Calderón - Base de Datos y Perfiles.

Proyecto - Universidad de Guanajuato