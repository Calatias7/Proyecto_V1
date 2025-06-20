# Proyecto_V1
Para una versión en inglés consulta [README.en.md](README.en.md).

Esta es una aplicación web sencilla para gestionar flashcards sin utilizar frameworks. Ahora permite agrupar las tarjetas en **mazos** y crear dos tipos de tarjetas:

- **Clásica**: contiene pregunta y respuesta.
- **Falso/Verdadero**: contiene un enunciado y una marca que indica si es verdadero.

Las tarjetas se almacenan en `localStorage` para que persistan entre recargas del navegador.

## Estructura

- `index.html` contiene la estructura básica de la página y el formulario.
- `style.css` define el aspecto de la interfaz.
- `src/app.js` contiene la lógica principal e importa los módulos de almacenamiento y mazos.

Para probar la aplicación necesitas ejecutar un servidor local (por ejemplo `npm start`).
Al usar módulos ES no es posible abrir `index.html` directamente.

## Instalación

Instala las dependencias del proyecto y ejecuta el servidor incluido con los siguientes comandos:

```bash
npm install
npm start
```

Esto iniciará `serve` sobre la carpeta actual. Abre el navegador en la dirección que indique la terminal para acceder a la app.

## Uso

1. Selecciona el tipo de tarjeta y completa los campos del formulario.
2. Selecciona o crea un **mazo** para organizar tus tarjetas.
3. Pulsa **Guardar tarjeta** para almacenarla.
4. En cada tarjeta aparecerán los botones **Editar** y **Eliminar**:
   - **Editar** carga la tarjeta en el formulario para modificarla; al guardar se reemplaza la versión anterior.
   - **Eliminar** borra únicamente esa tarjeta de la lista.
5. El botón **Eliminar todas** elimina todas las tarjetas guardadas en `localStorage`.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un problema o quieres proponer una mejora, abre un *issue* o envía un *pull request* siguiendo el flujo estándar de GitHub.


