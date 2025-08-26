/**
 * @description Modelo de datos de los datos de la lista de productos para el guardado de la configuración
 * de la gestión de comprobantes
 *
 * @export
 * @interface GraficaEstatusRespuesta
 * @since 29/09/2023
 * @author NTTDATA
 * @version 1.0
 */
export class GraficaEstatusRespuesta {
    /*Atributo para el valor del id del Backend*/
    idCliente: string = "";
    /*Atributo para el valor del nombre del Backend*/
    fechaIni: string = "";
    /*Atributo para el valor del numero IP del Backend*/
    fechaFin: string = "";
    /*Atributo para el valor del numero protocolo  del Backend*/
    idEstatus: string = "";
    /*Atributo para el valor del numero IP del Backend*/
    nombreBenef: string =  "";
    /*Atributo para el valor del numero IP del Backend*/
    numeMovil: number =  0;
}