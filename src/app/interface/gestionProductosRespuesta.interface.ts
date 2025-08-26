/**
 * @description Modelo de datos de los datos de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface BackendRespuesta
 * @since 29/09/2023
 * @author NTTDATA
 * @version 1.0
 */
export class GestionProductosRespuesta {
    idProduct: number = 0;
    descProd: string = "";
    bandTipoCargo: string = "";
    bandVigencia: string = "";
    bandEmail: string = "";
    bandReintentos: string = "";
    idBack: number = 0;
    nombre: string = "";
    cveProd: string = "";
    umbral: string = "";
    visibilidad: string = "";
    cveProdOper: string = "";
    codiOperCarg: string = "";
    codiOperAbon: string = "";
    bandConfirming: string = "";
    bandActivo: string = "";
    codiOperComi: string = "";
    diasFecApli: string = "";
    diasFecOper: string = "";
    diasTecTran: string = "";
  }
