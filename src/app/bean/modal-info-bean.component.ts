/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * canales-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzales      Santander   Creacion de la interfaz para modal info                                         
 */
export class ModalInfoBeanComponents {
    constructor(
        public titulo: String,
        public contenido: String, 
        public type?: 'error' | 'info' | 'confirm' | 'alert' |'help' | 'aviso' | 'yesNo' | 'selectAction',
        public errorCode?: String, 
        public sugerencia?: String,
        public englishType?: Boolean,
        public emailToAddUpdate?: {email: string, isNew: boolean },
        ){
    }
}