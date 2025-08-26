/**
 * @description Modelo de datos para guardar los ids de 
 * los archivos seleccionados para la peticion de generar xml
 * 
 * @export
 * @class IGenerateXmlFileRequest
 * @since 26/05/2022
 * @author Felipe Cazarez
 * @version 1.0
 */
 export interface IGenerateXmlFileRequest{
    /** Propiedad para guardar el listado de los ids */
    listaIds:number[];
    /** Propiedad para guardar el nombre o id del usuarioS */
    idUsuario:string;
}