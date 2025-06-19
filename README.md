# Proyecto_V1

Esta es una aplicación web sencilla para gestionar flashcards y mazos sin utilizar frameworks. Permite crear dos tipos de tarjetas:

- **Clásica**: contiene pregunta y respuesta.
- **Falso/Verdadero**: contiene un enunciado y una marca que indica si es verdadero.

Las tarjetas se agrupan en *mazos* que también se guardan en `localStorage` para que persistan entre recargas del navegador.

## Estructura

- `index.html` contiene la estructura básica de la página y el formulario.
- `style.css` define el aspecto de la interfaz.
- `script.js` implementa la lógica de creación de mazos y tarjetas, su renderizado y eliminación.

Para probar la aplicación solo abre `index.html` en tu navegador.

## Instalación

Instala las dependencias del proyecto y ejecuta el servidor incluido con los siguientes comandos:

```bash
npm install
npm start
```

Esto iniciará `serve` sobre la carpeta actual. Abre el navegador en la dirección que indique la terminal para acceder a la app.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un problema o quieres proponer una mejora, abre un *issue* o envía un *pull request* siguiendo el flujo estándar de GitHub.


