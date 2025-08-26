/**
 * @description Modelo de datos para guardar
 * la informacion del catalogo
 * 
 * @export
 * @interface ICatalogo
 * @since 10/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface ICatalogo {
    /** Propiedad para guardar el id del catalogo */
    idCat:number;
    /** Propiedad para la descripcion del catalogo */
    descripcionCatalogo:string;
    /** Propiedad para el estatus */
    estatusActivo:string;
}
