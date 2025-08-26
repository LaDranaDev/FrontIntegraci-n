/**
 * @description Modelo de datos de los datos de respuesta de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface IProductoResponse
 * @since 21/09/2022
 * @author NTTDATA
 * @version 1.0
 */
export interface IProductoResponse {
  /** variable para el id contrato producto*/
  idContratoProducto: string;
  /** variable para la descripcion del producto*/
  descProducto: string;
  /** variable para la bandera comprobante */
  banderaComprobante: string;
  /** Variable para la bandera activa servicio 24x7 */
  activa24x7: string;
  /** Variable para la bandera visualizar habilitar la selección del servicio 24x7 */
  vis24x7: string;
}