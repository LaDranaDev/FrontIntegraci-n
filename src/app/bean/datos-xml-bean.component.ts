/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * datos-xml-bean.component.ts
 * Control de versiones:
 * Version  Date/Hour               By                  Company     Description
 * -------  ----------     -------------------------    --------    ----------------------------------------------
 * 1.0      26/04/2022     Jonathan Lopez Gonzalez      Santander   Creacion de la interfaz para transportar la informacion 
 *                                                                  correspondiente al xml a generar
 */
export interface GeneraXMLBeanComponent {
    bandacum:string;
    idcnrlrepcob:string;
    idcntr:string;
    ctas:string[];
    idlay:string;
    contrepcob: string,
    fechreg:string;
    horacort:string;
    idfrec:string;
    idcatestatus:string;
    tabla:string;
    idcanl:string;
    flgcont:string;
    claconescargo:string;
    claconesabono:string;
    flgh2hrepcobsig:string;
    flgh2hrepcobcvr:string;
}
