/**
 * @description Modelo de datos para la consulta de las graficas por cliente 
 * @export
 * @interface IGraficaCliente
 * @since 10/05/2023
 * @author NTTDATA
 */

export class IGraficaCliente{ 
     //Atributo para indicar el código del cliente
    codigoCliente: String; 
    //Atributo para indicar las operaciones 
    operaciones: String; 
    //Atributo para el monto
    monto: String; 
    //Atributo para la fechaInicio
    fechainicio: String; 
    //Atributo para la fechaFin
    fechaFin: String; 
}