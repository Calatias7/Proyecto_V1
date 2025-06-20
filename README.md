# Proyecto_V1
Para una versión en inglés consulta [README.en.md](README.en.md).

Esta es una aplicación web sencilla para gestionar flashcards sin utilizar frameworks. Ahora permite agrupar las tarjetas en **mazos** y crear dos tipos de tarjetas:

- **Clásica**: contiene pregunta y respuesta.
- **Falso/Verdadero**: contiene un enunciado y una marca que indica si es verdadero.

Las tarjetas se almacenan en `localStorage` para que persistan entre recargas del navegador.

El diseño de la interfaz se ha refinado para ofrecer cartas y botones con un estilo elegante y minimalista.

## Estructura

- `index.html` contiene la estructura básica de la página y el formulario.
- `style.css` define el aspecto de la interfaz.
- `src/app.js` junto con `src/theme.js` y `src/study.js` contiene la lógica principal e importa los módulos de almacenamiento y mazos.

Puedes ejecutar la aplicación abriendo directamente `index.html` en tu navegador.
Si lo prefieres, también puedes iniciar un servidor local con `npm start`.

## Instalación

Requiere **Node.js 18 o superior**. Después instala las dependencias del proyecto:
Instala las dependencias ejecutando:

```bash
npm install
```

## Ejecutar el servidor

Inicia el servidor integrado con:

```bash
npm start
```

El comando anterior iniciará un pequeño servidor en `http://localhost:3000`.

## Ejecutar las pruebas

Las pruebas se ejecutan con el test runner de Node.js:

```bash
npm test
```

## Uso

1. Selecciona el tipo de tarjeta y completa los campos del formulario.
2. Selecciona o crea un **mazo** para organizar tus tarjetas.
3. Pulsa **Guardar tarjeta** para almacenarla.
4. En cada tarjeta aparecerán los botones **Editar** y **Eliminar**:
   - **Editar** carga la tarjeta en el formulario para modificarla; al guardar se reemplaza la versión anterior.
   - **Eliminar** borra únicamente esa tarjeta de la lista.
5. El botón **Eliminar todas** borra únicamente las tarjetas del mazo seleccionado.

## Copias de seguridad

En la sección de gestión de mazos dispones de los botones **Importar** y **Exportar**.
**Exportar** descarga un archivo JSON con todos tus mazos y tarjetas, mientras que
**Importar** permite restaurar esa información desde un archivo similar.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un problema o quieres proponer una mejora, abre una *issue* o envía un *pull request* siguiendo el flujo estándar de GitHub. Recuerda ejecutar `npm test` antes de enviar tu propuesta.


