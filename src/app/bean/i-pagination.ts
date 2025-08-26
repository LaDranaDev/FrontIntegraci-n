/**
 * @description clase de datos para el request de la paginacion
 * 
 * @export
 * @interface IPaginationRequest
 * @since 15/08/2022
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IPaginationRequest {
    /** Variable para la propiedad page */
    page:number;
    /** Variable para la propiedad limit */
    size:number;
    ruta:any;
}


