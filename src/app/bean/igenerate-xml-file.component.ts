/**
 * @description Modelo de datos para llenar el primer grid ademas
 * con estos datos se podra generar el archivo xml
 *
 * @export
 * @Interface IGenerateXmlFileComponent
 * @since 12/05/2022
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IGenerateXmlFileComponent{
    /** variable para el id de archivo secuencial */
    id:number;
    /** Variable para el id del archivo fk*/
    idArchivoFk:number;
    /** Variable para el nombre del archivo */
    nombreFile:string;
    /** Variable para el tipo de archivo */
    tipoFile:string;
    /** Variable para la fecha de backup */
    fechaBackup:string;
    /** Variable para la fecha de registro */
    fechaRegistro:string;
    /** Variable para la ruta de backup del archivo */
    rutaFileBackup:string;
    /** Variable para el nombre del archivo zip generado*/
    nombreArchivoZip:string;
    /** Variable para el id del contrato fk*/
    idContrFk:number;
    /** Variable para el total de mb del mensaje */
    msgMB:number;
    /** variable para el estatus del archivo */
    statusFile:string;
 }
