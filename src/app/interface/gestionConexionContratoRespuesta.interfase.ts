/**
 * @description Modelo de datos de los datos de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface gestionConexionContratoRespuesta
 * @since 30/03/2023
 * @author NTTDATA
 * @version 1.0
 */
export class gestionConexionContratoRespuesta {
    /*Atributo para el valor número de contrato*/
    numeroContrato: string = "";
    /*Atributo para el valor del código del cliente*/
    codigoCliente: string = "";
    /*Atributo para el valor de la razón social*/
    razonSocial: string = "";
    /*Atributo para el valor de cuenta eje*/
    cuentaEje: string = "";
    /*Atributo para el valor del estatus*/
    estatus: string = "";
    /*Atributo para el valor del protocolo*/
    protocolo: string = "";
  }
  