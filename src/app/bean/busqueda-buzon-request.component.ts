import { ProductoRequest } from "./producto-request.component";

/**
 * @description Modelo de datos para los datos de entrada de la consulta de buzon
 *
 * @export
 * @class BusquedaBuzonRequest
 * @since 12/10/2022
 * @author NTTDATA
 * @version 1.0
 */
export class BusquedaBuzonRequest {
    /** Variable para la aplicacion */
    aplicacion: string = "";
    /** Variable para la ruta o path del buzon */
    ruta: string = "";
    /** Variable para la ruta o path detalle del buzon */
    rutaDetalle: string = "";
    /** Variable para la ruta o path anterior del buzon */
    rutaAnterior: string = "";
}