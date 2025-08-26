import { ProductoRequest } from "./producto-request.component";

/**
 * @description Modelo de datos para los datos de salida de los archivos del ls de la consulta de buzon
 *
 * @export
 * @class ArchivosBuzonResponse
 * @since 12/10/2022
 * @author NTTDATA
 * @version 1.0
 */
export class ArchivosBuzonResponse {
    /** Variable para definir el tamaño del archivo */
    tamanio: string = "";
    /** Variable para definir los permisos del archivo */
    permisos: string = "";
    /** Variable para definir la fecha de creación del archivo */
    fecha: string = "";
    /** Variable para definir el nombre del archivo */
    nombre: string = "";
    /** Variable para definir la ruta del archivo */
    path: string = "";
}