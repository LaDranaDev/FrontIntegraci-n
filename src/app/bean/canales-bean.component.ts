/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * canales-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para la obtencion
 *                                                                        de clacones
 */

 export interface CanalesBeanComponents {
    /*Atributo para el valor del id del canal*/
    idCanal: string;
    /*Atributo para el valor del nombre del canal*/
    nombre: string;
    /*Atributo para el valor de la descripcion del canal*/
    descripcion: string;
    /*Atributo para el valor del estado del canal*/
    estadoCanal: string;
    /*Atributo para el valor del id del contrato*/
    idCntr: string;
    /*Atributo para el valor del estado de seleccion del canal*/
    nombestadoSeleccionre: string;

}
