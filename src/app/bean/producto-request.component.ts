/**
 * @description Modelo de datos de los datos de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface ProductoRequest
 * @since 21/09/2022
 * @author NTTDATA
 * @version 1.0
 */
export class ProductoRequest {
  /** variable para el id contrato producto*/
  idContratoProducto: string = "";
  /** variable para la bandera comprobante */
  banderaComprobante: string = "";
  /** Variable para la bandera activa servicio 24x7 */
  activa24x7: string = "";
}