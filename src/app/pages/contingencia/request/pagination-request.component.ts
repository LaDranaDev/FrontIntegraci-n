/**
 *
 * @description clase de datos para el request de la peticion de buzones
 * la cual incluye la paginacion
 * 
 * @export
 * @interface IPaginationRequest
 * @since 2/05/2022
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IPaginationRequest{
    /** Variable para la propiedad page */
    page:number;
    /** Variable para la propiedad limit */
    size:number;
    /** Variable para la propiedad de nombre buzon buscar */
    ruta:string;
}