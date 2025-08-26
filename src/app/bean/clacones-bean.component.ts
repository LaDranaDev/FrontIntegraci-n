/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * clacones-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para la obtencion 
 *                                                                        de clacones
 */

 export class ClaconesBeanComponents {
    /*Atributo para el valor del id Catalogo*/
    idCatalogo: string = "";
    /*Atributo para el valor de la descripcion del clacon*/
    descripcionCatalogo: string = "";
    /*Atributo para el valor del estatus del clacon*/
    estatusActivo: string = "";
    /*Atributo para el valor del estatus final*/
    estatusFinal: string = "";
    /*Atributo para el valor del clacon*/
    valor: string = "";

    /* Constructor de clase */
    constructor(values: Object = {}) {
        Object.assign(this, values)
    }
}