/**
* @description Modelo de datos para la consulta de los parametros
* y mostrar la informacion en la tabla
*
* @export
* @Interface IConsultaParametros
* @since 19/08/2022
* @author NTTDATA
* @version 1.0
*/
export interface IConsultaParametros{
    /** variable para el id del parametro */
    id:number;
    /** Variable para el nombre del parametro*/
    nombre:string;
    /** Variable para el valor del parametro */
    valor:string;
    /** Variable para la descripcion del parametro */
    descripcion:string;
    /** Variable para el estatus del parametro */
    estatus:string
}