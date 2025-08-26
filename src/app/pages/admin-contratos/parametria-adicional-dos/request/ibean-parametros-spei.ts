
/**
 * @description Modelo de datos para guardar la informacion del bean
 * 
 * @interface IBeanParametrosSPEI
 * @version 1.0
 */
export interface IBeanParametrosSPEI {
    /** Bandera Check activo (A) o inactivo (I), para SPEI mayor a 8000 fuera de horario */
    chkSpeiFueraHorario: string;
    /** Monto máximo acumulado, SPEI fuera de horario */
    speiMaxAcumulado: any;
    /** Monto máximo por operación, SPEI fuera de horario */
    speiMaxPorOper: any;
    /** Monto usado del acumulado, SPEI fuera de horario */
    speiMontoAcumulado: any;
    /** Bandera Check activo (A) o inactivo (I), para SPEI mayor a 8000 fuera de horario */
    chkRepChqSeg: string;
    /** Bandera Check activo (A) o inactivo (I), para SPEI mayor a 8000 fuera de horario */
    chkEntRepNex: string;
    /** Monto máximo acumulado, SPEI fuera de horario anterior*/
    speiMontoAcumuladoAnt: any;
}
