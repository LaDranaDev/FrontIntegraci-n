/**
 * @description Modelo de datos para conuslta de vigencia de buzones
 * y mostrar la informacion en la tabla
 *
 * @export
 * @Interface IConsultaBuzon
 * @since 27/04/2022
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IConsultaBuzon{
    /** variable para el id del buzon */
    id:number;
    /** Variable para el nombre del buzon */
    rutaMBox:string;
    /** Variable para la vigencia de dias del buzon */
    periodoVigencia:string;
    /** Variable para la fecha de purgado del buzon */
    fecha:string;
    /** Variable para el tamano del buzon */
    mbsize:string;
    /** Variable para el mensaje del buzon */
    numMsg:string;
    /** Variable para la expresion regular del buzon */
    regex:string;
    /** Variable para el estatus de leido */
    statusLeido:string;
    /** Variable para el estatus de respaldar */
    respaldar:string;
 }
