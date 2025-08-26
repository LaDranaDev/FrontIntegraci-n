/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * cuentas-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para la obtencion 
 *                                                                        de cuentas
 */

 export class CuentasBeanComponents {
    /*Atributo para el valor del id Contrato Cuenta*/
     idContratoCuenta: string = "";
    /* Atributo para el valor del id del Contrato*/
    idContrato: string = "";
    /*Atributo para el valor del numero de cuenta*/
    numCuenta: string = "";
    /*Atributo para el valor del tipo de Cuenta*/
    tipoCuenta: string = "";
    /*Atrbiuto para el valor de la bandera Intercambiaria*/
    bandIntercambiaria: string = "";
    /*Atributo para el valor de la bandera Personalidad*/
    bandPersonalidad: string = "";
    /*Atributo para el valor del titular*/
    titular: string = "";
    /*Atributo para el valor de la fecha de alta*/
    fechaAlta: string = "";
    /*Atributo para el valor de terceros*/
    terceros?: boolean;
    /*Atrbiuto para el valor del estatus de la cuenta*/
    statusCuenta: string = "";
    /*Atributo para el valor del codigo*/
    codigo: string = "";
    /*Atributo para el valor del tercero propio*/
    terceroPropio: string = "";
    /*Atributo para el valor bandera activo*/
    bandActivo: string = "";
    /*Atributo para el valor del id de la Divisa*/
    idDivisa: string = "";
    /*Atributo para el valor del id del Contrato Str*/
    idContratoStr: string = "";
    /*Atributo para el valor del numero de comision*/
    noComisiones: string = "";
    /*Atributo para el alor del bic*/
    bic: string = "";
    /*Atributo para el valor del bic anterior*/
    bicAnterior: string = "";
    /*Atributo para el valor la bandera para actualizar bic*/
    actualizaBic: string = "";

    /* Constructor de clase */
    constructor(values: Object = {}) {
        Object.assign(this, values)
    }
}