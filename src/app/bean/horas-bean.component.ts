/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * horas-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para la obtencion 
 *                                                                        de clacones
 */

 export interface HorasBeanComponents {
    /*Atributo para el valor del id del catalogo*/
    idCatalogo: string;
    /*Atributo para el valor de la descripcion del catalogo*/
    descripcionCatalogo: string;
    /*Atributo para el valor del estatus activo*/
    estatusActivo: string;
    /*Atributo para el valor del estatus final*/
    estatusFinal: string;
    /*Atributo para el valor del valor*/
    valor: string;

}