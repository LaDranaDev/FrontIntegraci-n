/**
 * @description Modelo de datos para la consulta de los bancos 
 *
 * @export
 * @interface GestionBancos
 * @since 10/04/2023
 * @author NTTDATA
 */

export class GestionBancos{
    //Atributo id banco 
    id:String
    //Atributo para el tipo de operación 
    tipoOperacion: String; 
    //Atributo para la clave
    claveIdentificacion: String; 
    //Atributo para el nombre del banco 
    nombre: String; 
    //Atributo para indicar si el banco esta activo o no 
    statusConvenioCcbn: String; 
    //Atributo para el nombre del banco 
    status: String; 
    //Atributo para el codigo de transferencia 
    codTransfer: String; 
    //Atributo para el codigo BSC
    codBic: String; 
}