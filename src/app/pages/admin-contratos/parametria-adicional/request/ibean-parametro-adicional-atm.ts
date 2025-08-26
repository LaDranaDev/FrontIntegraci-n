import { ICatalogo } from "./icatalogo";

/**
 * @description Modelo de datos para guardar
 * la informacion del bean
 * 
 * @export
 * @interface IBeanParametroAdicionalATM
 * @since 10/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IBeanParametroAdicionalATM {
    /** Propiedad para la lista de catalogos */
    lista:ICatalogo[];
    /** Propiedad para el id canal parametria adiciona */
    idCanalPaAd:number;
    /** Propiedad para la orden de pago atm activo checkbox */
    ordenPagoATMactivo:boolean;
    /** Propiedad para el id canal online */
    idCanalOnline:number;
    /** Propiedad para la ip del cliente */
    ipCliente:string;
    /** Propiedad para el codBice */
    codBICE:string;
    /** Propiedad para el id canal swift file */
    idcanalSwiftFile:string;
    /** Propiedad para el checkbox activar reporte consolidado order pago atm */
    chkRptActConsAtm:string;
    /** Propiedad para el checkbox activar reporte historico order pago atm */
    chkRptHistAtm:string;
    /** Propiedad para el checkbox activar reporte intradia order pago atm */
    chkRptIntrAtm:string;
    /** Propiedad para el checkbox activar validacion duplicados */
    chkValDuplicados:string;
    /** Propiedad para el checkbox mostrar odpatm */
    chkOdpAtm:string;
    /** Propiedad para el id canal */
    idCanal:number;
    /** Bandera para almacenar la opcion de Envio Clave de Rastreo chkCveRsto */
    chkCveRsto: string;
    /** Bandera para almacenar la opcion de Cliente VIP bandVip */
    bandVip: string;
    /**
     * Bandera para indicar si se almacena o se actualiza la opcion de Cliente VIP
     * bandVip
     * */
    bandCV: boolean;
    /** Bandera para almacenar la opcion de Entrega Estado de Cuenta Chequera y TDC chkEntregaEstadoCuenta */
    chkEntregaEstadoCuenta: string;
}
