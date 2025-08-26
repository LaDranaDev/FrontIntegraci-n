/**
 * @description Modelo de datos para el search de archivos
 * 
 * @export
 * @interface ISearchArchivoRequest
 * @since 5/05/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface ISearchArchivoRequest{
    /** Propiedad para guardar el nombre del archivo */
    nombreFile:string;
    /** Propiedad para guardar el tipo de archivo */
    tipoFile:string;
    /** Propiedad para guardar la fecha de inicio */
    fechaInicial:string;
    /** Propiedad para guardar la fecha de fin */
    fechaFinal:string;
    /** Propiedad para guardar el codigo de cliente */
    codigoCliente:string;
    /** Propiedad para guardar el numero de contrato del cliente */
    numContrato:string;
    /** Propiedad que contiene el id del usuario */
    idUsuario:string;
}