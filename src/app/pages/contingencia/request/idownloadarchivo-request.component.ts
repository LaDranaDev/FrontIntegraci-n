/**
 * @description Modelo de datos para descargar el archivo seleccionada
 * del segundo grid
 * 
 * @export
 * @interface IDownloadArchivoRequest
 * @since 20/05/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IDownloadArchivoRequest{
    /** Propiedad para guardar el id del archivo zip */
    idSoliArch:number;
    /** Propiedad para guardar el nombre del archivo */
    nombreFile:string;
}