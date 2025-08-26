/**
 * @description Modelo de datos para conuslta de vigencia de buzones
 * y mostrar la informacion en la tabla
 *
 * @export
 * @Interface IConsultaCatalogo
 * @since 04/08/2022
 * @author NTTDATA
 * @version 1.0
 */
 export interface IConsultaCatalogo{
    /** variable para el id del catalogo regi*/
    idReg:number;
    /** variable para el id del catalogo */
    idCat:number;
    /** Variable para el valor */
    valor:string;
    /** Variable para la descripcion */
    descr:string;
    /** Variable para la descripcion 2*/
    descr2:string;
    /** Variable para la descripcion 3*/
    descr3:string;
    /** Variable para la descripcion 4*/
    descr4:string;
    /** Variable para el valor de banda activa */
    bandAct:string;
    /** Variable para el valor de banda modificada */
    bandModifica:string;
  }