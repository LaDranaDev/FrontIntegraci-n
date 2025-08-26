/**
 * @description Modelo de datos para la peticion
 * hacia la obtencion de los parametros adicionales
 * preload
 * 
 * @export
 * @interface IAdditionalEnviromentRequest
 * @since 09/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IAdditionalEnviromentRequest {
    /** numero del contrato */
    folioEnc:string;
    /** numero del contrato si no hay folioenc*/
    hdnContratoFolio:string;
    /** numero del contrato oculto en vista*/
    folioEncHdn:string;
    /** lista de horarios habilitado o por habilitar en el contrato para reporte
	 * Intradia*/
    horarios:string;
    /** id del canal para la parametria Adicional*/
    idCanalPaAd:string;
    /** id del canal para Reportes de Devoluciones Online*/
    idCanalOnline:string;
    /** iP Cliente para parametria Adicional*/
    ipCliente:string;
    /** BIC de emisiones para envio de archivos por swift fin para parametria
	 * Adicional*/
    codBICE:string;
    /** id del contrato*/
    idCntr:String;
    /** Formato par aa exportacion del reporte de parametros adicionales*/
    formato:String;
    /** Bandera para almacenar la opcion de Validar Duplicados chkRptActConsAtm.*/
    chkValDuplicados:string;
    /** Bandera para almacenar la opcion de Reporte de Consilidad de Orden de Pago
	 * chkRptActConsAtm.*/
    chkRptActConsAtm:string;
    /** Bandera para almacenar la opcion de Reporte de historico de Orden de Pago
	 * chkRptActConsAtm*/
    chkRptHistAtm:string;
    /** Bandera para almacenar la opcion de Reporte de Intradia de Orden de Pago
	 * chkRptActConsAtm*/
    chkRptIntrAtm:string;
    /** Bandera para almacenar la opcion de Mostrar referencia de cobro en archivo de
	 * respuesta a OdP por ATM*/
    chkOdpAtm:string;
     /** Activa optimus.*/
    activaOptimus:boolean;
    /** id del canal de optimus*/
    idCanal:string;
     /** variable horariosEspec de tipo string*/
    horariosEspec:string;
    /**The contratos prod*/
    contratosProd:string;
    /** Usuario de la sesion actual */
    usrReporte:string | null;
}
