/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 *
 * session-bean.component.ts
 * Control de versiones:
 *
 * Version  Date/Hour               By                                  Company     Description
 * -------  -------------------     --------------------------------    --------    --------------------------------------------------
 * 1.0      02/01/2019              827026: Isaac Jesus Romero Cruz     TCS SFW     Bean que declara los atributos para de la sesssion
 */
 export class SessionBeanComponent {
    /** El dato del usuario logado*/
    usuarioSession: string = "";
    /** El idSession generado de la aplicacion, este es requerido para mantener la session*/
    idSession: string = "";
    /** Dato que indica si esta logado*/
    logged?: boolean;
    /** Dato que indica cuando se loggeo*/
    loggedInSession?: number;
    /** Atributo que define los mensajes de la operacion*/
    mensajes: string = "";
    /* Constructor de clase */
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
