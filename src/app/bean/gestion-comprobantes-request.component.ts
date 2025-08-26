import { ProductoRequest } from "./producto-request.component";

/**
 * @description Modelo de datos para los datos de entrada de la gestion de comprobantes
 *
 * @export
 * @class IGestionComprobantesRequest
 * @since 21/09/2022
 * @author NTTDATA
 * @version 1.0
 */
export class GestionComprobantesRequest {
    /** Variable para lista de productos */
    productos: ProductoRequest[] = [];
}