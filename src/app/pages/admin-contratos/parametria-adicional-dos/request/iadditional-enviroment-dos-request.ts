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
export interface IAdditionalEnviromentDosRequest {
    /** numero del contrato */
    folioEnc: string;
    /** id del contrato*/
    idCntr: string;
    /** Bandera Check activo (A) o inactivo (I), para SPEI mayor a 8000 fuera de horario */
	bandSpeiFueraHorario: string;
    /** Monto máximo acumulado, SPEI fuera de horario */
    speiMaxAcumulado: any;
    /** Monto máximo por operación, SPEI fuera de horario */
    speiMaxPorOper: any;
    /** Usuario de la sesion actual */
    usrReporte: string | null;
    /** Bandera Check activo (A) o inactivo (I), para generar reporte chequera de seguridad */
	bandRepChqSeg: string;
    /** Bandera Check activo (A) o inactivo (I), para entregar reporte por nexus */
	bandEntRepNex: string;
}
