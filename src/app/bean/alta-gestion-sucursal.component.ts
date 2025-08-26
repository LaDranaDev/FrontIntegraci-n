/**
 * @description Modelo de datos para alta del catalogo
 *
 * @export
 * @class AltaCatalogoDinamico
 * @since 04/08/2022
 * @author NTTDATA
 * @version 1.0
 */
export class AltaSucursal{
    /** Variable para el identificador de la sucursal */
    id:string = '';
    /** Variable para el nombre de la sucursal */
    sucursal:string = '';
    /** Variable para la latitud de la sucursal*/
    latitud:string = '';
    /** Variable para la longitud de la sucursal */
    longitud: number = 0;
    /** Variable para la direccion de la sucursal */
    direccion: string = '';
    /** Variable para el codigo postal de la sucursal */
    cp: string = '';
    /** Variable para si es activo la sucursal */
    activo: string = '';
}