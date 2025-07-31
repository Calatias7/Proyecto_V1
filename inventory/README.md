# Sistema de Inventario en PHP

Este directorio contiene un ejemplo sencillo de sistema de inventario pensado para ejecutarse en un servidor local XAMPP.

## Requisitos

- **XAMPP** con los servicios de Apache y MySQL activos.
- PHP 7 o superior.

## Instalación

1. Copia la carpeta `inventory` dentro del directorio `htdocs` de XAMPP.
2. Crea la base de datos ejecutando el script `schema.sql` en phpMyAdmin o desde la consola de MySQL.
3. Ajusta las credenciales de `db.php` si es necesario.
4. Abre `http://localhost/inventory/index.php` en tu navegador.

## Uso

Desde la página principal podrás añadir, editar y eliminar productos.
Utiliza el campo de **buscar** para filtrar la lista por nombre y confirma la eliminación de cada registro mediante la ventana emergente.

## Estructura de archivos

- `index.php` pantalla principal con el listado y formulario de alta.
- `add_product.php` guarda un nuevo producto en la base de datos.
- `edit.php` carga el formulario para editar un producto existente.
- `edit_product.php` actualiza la información editada.
- `delete_product.php` elimina un producto.
- `db.php` configuración de conexión a MySQL.
- `schema.sql` crea la base de datos `inventario_db` y la tabla `productos`.
- `styles.css` estilos básicos.
- `script.js` funciones en JavaScript para búsqueda y confirmaciones.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
