/**
 * @description Modelo de datos para la consulta del historial de buzon 
 * @export
 * @interface ITamIHistorialBuzonanoBuzon
 * @since 16/05/2023
 * @author NTTDATA
 */

export class IHistorialBuzon{ 
    //Atributo para indicar el tamanoMB
   idBuzon: String;
   //Atributo para indicar el tamanoMB
   searchFecha: String;
   //Atributo para indicar el tamanoMB
   tamanoMB: String; 
   //Atributo para indicar el total
   total: String; 
   //Atributo para la fechaInicio
   fechaInicio: String; 
   //Atributo para la fechaFin
   fechaFin: String; 
   //Atributo para los puntos altos
   puntosAltos: String; 
   //Atributo para los puntos bajos
   puntosBajos: String; 
}