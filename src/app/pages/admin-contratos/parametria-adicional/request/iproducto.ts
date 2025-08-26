/**
 * @description Modelo de datos para mostrar
 * la informaicon del producto
 * 
 * @export
 * @interface IProducto
 * @since 09/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IProducto {
    /** Propiedad para el id de producto */
    productId:number;
    /** Propieddad para la descripcion del producto */
    productDescription:string;
    /** Propiedad para la bandera de programation */
    flagProgramation:string;
    /** Propiedad para el contractProductoId */
    contractProductId:number;
    /** Propiedad para el status */
    status:string;
}
