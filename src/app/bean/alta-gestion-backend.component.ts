/**
 * @description Modelo de datos para alta del catalogo
 *
 * @export
 * @class AltaCatalogoDinamico
 * @since 04/08/2022
 * @author NTTDATA
 * @version 1.0
 */
export class AltaBackend{
    /** Variable para el nombre del backend */
    nombre:string = '';
    /** Variable para la direccion Ip del backend */
    dirIp:string = '';
    /** Variable para la protocolo del backend */
    idProtocol: number = 0;
    /** Variable para la ver si esta activo(1) o no(0) el backend */
    bandActivo: number = 0;
}