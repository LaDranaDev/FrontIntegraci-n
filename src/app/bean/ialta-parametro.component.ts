/**
 * @description Modelo de datos para alta del catalogo
 *
 * @export
 * @class IAltaParametro
 * @since 22/08/2022
 * @author NTTDATA
 * @version 1.0
 */
 export interface IAltaParametro{
    /** Variable para el nombre del parametro*/
    nombre:string;
    /** Variable para el valor del parametro */
    valor:string;
    /** Variable para la descripcion del parametro */
    descripcion:string;
}