/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * config-repcob-cuenta-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para la obtencion
 *                                                                        de clacones
 */

 export interface ConfigRepCobCtaBeanComponents {
    /*Atributo para el valor de la bandera intradia*/
    intradia: boolean;
    /*Atributo para el valor de la bandera intradiacierre*/
    intradiaCierre: boolean;
    /*Atributo para el valor de la bandera consolidado por dia*/
    consolidadoxDia: boolean;
    /*Atributo para el valor de recibir archivo*/
    recibirArchivo: string;
    /*Atributo para el valor del tipo de contenido*/
    tipoContenido: string;
    /*Atributo para el valor del canal*/
    canal: string;
    /*Atributo para el valor del formato*/
    formato: string;
    /*Atributo para el valor del formato consolidado*/
    formatoConsolidado: string;
    /*Atributo para el valor de la bandera de cierre*/
    bandCierre: Boolean;
    /*Atributo para el valor de la bandera de los clacones abono*/
    todosClaconesAbono: boolean;
    /*Atributo para el valor de la bandera de los clacones cargo*/
    todosClaconesCargo: boolean;
    /*Atributo para el valor de la bandera para signos negativos*/
    bandCobranzaSig: string;
    /*Atributo para el valor de la bandera para mostrar cuenta clave*/
    bandCobranzaCvrt: string;
    /*Atributo para el valor de la bandera para anulaciones*/
    bandAnulaciones: string;

}
