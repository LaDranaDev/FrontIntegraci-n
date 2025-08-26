/**
 * @description Modelo de datos para
 * la consulta de cuentas beneficiarias 
 *
 * @class BusquedaClaveAba
 * @since 24/04/2023
 * @author NTTDATA
 * @version 1.0
 */
export interface ClaveAbaRespuesta {
    /** Variable para la clave*/
    codigoTransfer:string; 
    /** Variable para la descripción*/
    nombre:string;
    //Variable para el catalogo de consultas ABA 
    catalogo:string; 
    
}