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

export class CierreProductoRespuesta {
    
    idProducto: number = 0;
    
    descipcionProd: string = "";
    
    claveProducto: string = "";
    
    cveProdOper: string = "";
    
    hora: number =  0;

    minutos: number =  0;

    bandera: string = "";

    horaFin:number =  0;
}