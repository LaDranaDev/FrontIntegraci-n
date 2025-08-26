/**
 * @description Modelo de datos para 
 * la consulta de los parámetros 
 * @export
 * @interface GestionParametros
 * @since 19/04/2023
 * @author NTTDATA
 */

export class GestionParametros{
    //Atributo para el id parametro
    idParametro: number; 
    //Atributo para el id protocolo
    idProtocolo: number; 
    //Atributo para el nombre del parámetro 
    nombreParametro: String; 
    //Atributo
    nombIntr: String; 
    //Atributo para el codigo del parámetro 
    codigo: String; 
    //Atributo para la longitud del parámetro 
    longitud: number; 
    //Atributo para el formato del parámetro 
    formato: number; 
    //Atributo para el estatus activo o no del parámetro
    paraActivo: boolean; 
    //Atributo para definir si el parámetro es cifrado
    cifrado: boolean; 
    //Atributo para definir si el parámetro es requerido
    requerido: boolean; 
    //Atributo
    editable: boolean; 

    
      
      
      
      
      
      
      
}