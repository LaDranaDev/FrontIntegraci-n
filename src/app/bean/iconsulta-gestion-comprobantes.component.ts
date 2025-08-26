/**
 * @description Modelo de datos para la consulta de
 * gestion de comprobantes
 * 
 * @export
 * @interface IConsultaGestionComprobantes
 * @since 5/09/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IConsultaGestionComprobantes{
    /** Propiedad para mostrar el nombre del producto */
    nombreProducto:string;
    /** Propiedad para mostrar la entrega al buzon del cliente */
    entregaBuzonCliente:string;
    /** Propiedad para mnostrar si esta activo las 24 horas los 7 dias de la semana */
    activo24x7:string;
}