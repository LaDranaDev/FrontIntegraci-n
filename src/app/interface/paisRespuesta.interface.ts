/**
 * @description Modelo de datos de los datos de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface PaisRespuesta
 * @since 29/09/2023
 * @author NTTDATA
 * @version 1.0
 */
export class PaisRespuesta {
  /*Atributo para el valor del id del ISO*/
  codigoISO: string = "";
  /*Atributo para el valor del nombre del pais*/
  nombre: string = "";
  /*Atributo para el valor del código*/
  codigoTransfer: string = "";
}