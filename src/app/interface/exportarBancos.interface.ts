/**
 * @description Modelo de datos para la exportación de los bancos
 *
 * @export
 * @interface GestionBancos
 * @since 13/04/2023
 * @author NTTDATA
 */

export class ExportarBanco{
    //Atributo para la clave
    claveIdentificacion: String; 
    //Atributo para el nombre del banco 
    nombre: String; 
    //Atributo del usuario
    usuarioActual: string;
}