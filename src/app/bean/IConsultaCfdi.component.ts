/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 *
 * IConsultaCfdi.component.ts
 * Control de versiones:
 *
 * Version  Date/Hour               By                                       Company     Description
 * -------  -------------------     --------------------------------------   --------    -----------------------------------------------
 * 1.0      20/07/2022              Z448853: Orlando Michael Mujica Garcia    TCS SFW     Bean que declara los atributos para la consulta de cfdi
 */

export interface IConsultaCfdiComponent {

    /** variable para el uuid del registro de cfdi */
    uuid:string;
    /** variable para el folio del registro de cfdi */
    folio: number;
    /** variable para el foliointerno del registro de cfdi */
    folioInterno: number;
    /** variable para el estatus del registro de cfdi */
    estatus: string;
    /** variable para el tfc emisor del registro de cfdi */
    rfcEmisor:string;
    /** variable para el rfc receptor del registro de cfdi */
    rfcReceptor: string;
    /** variable para el fecha emision del registro de cfdi */
    fechaEmision: string;
    /** variable para el subtotal del registro de cfdi */
    subtotal: string;
    /** variable para el iva del registro de cfdi */
    iva:string;
    /** variable para el total del registro de cfdi */
    total: string;
}