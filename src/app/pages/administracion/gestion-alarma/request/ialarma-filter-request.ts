/**
 * @description Modelo de datos para la busqueda
 * de las alarmas
 * 
 * @export
 * @interface IAlarmaFilterRequest
 * @since 12/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IAlarmaFilterRequest {
    /** propiedad para guardar el tipo de notificacion */
    idTipoCat:string;
    /** Propiedda para guardar el estatus */
    estatus:string;
    /** Propiedad para guardar la fecha atendida */
    fechaAtencion:string;
    /** Propiedad para guardar la fecha de generacion */
    fechaGenerada:string;
}
