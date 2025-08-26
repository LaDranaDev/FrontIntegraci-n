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
export class SucursalesRespuesta {
    /*Atributo para el valor del id de la sucursal*/
    id: number = 0;
    /*Atributo para el valor del nombre de la sucursal*/
    sucursal: string = "";
    /*Atributo para el valor de la latitud de la sucursal*/
    latitud: string = "";
    /*Atributo para el valor de la longitud de la sucursal*/
    longitud: string = "";
    /*Atributo para el valor de la direccion de la sucursal*/
    direccion: string = "";
    /*Atributo para el valor del codigo postal de la sucursal*/
    cp: string = "";
    /*Atributo para el valor si es A o no de la sucursal*/
    activo: string = "";
  }

    
    