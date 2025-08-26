/**
 * @description Modelo de datos para llenar el segundo grid ademas
 * trae la consulta para poder descargar de archivos rar
 *
 * @export
 * @Interface IDownloadRarFilesComponent
 * @since 24/05/2022
 * @author Felipe Cazarez
 * @version 1.0
 */

 export interface IDownloadRarFileComponent{
    /** variable para el id del archivo */
    id:number;
    /** Variable para el id de la solicitud */
    idSolicitud:number;
    /** Variable para el id de usuario*/
    idUsuario:string;
    /** Variable para el tipo de archivo */
    flgTipoArchivo:string;
    /** Variable para el estatus de la peticion del archivo */
    estatusSolicitud:string;
    /** Variable para el nombre del archivo rar */
    nombreArchivoZip:string;
    /** Variable para la fecha de registro */
    fechaRegistro:string;
    /** Variable para determinar si se deshabilitara el checkbox o no */
    disableCheck:boolean;
}
