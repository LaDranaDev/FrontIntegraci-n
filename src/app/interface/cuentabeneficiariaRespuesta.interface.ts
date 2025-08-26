
/**
 * @description Modelo de datos para los datos 
 * para la consulta de cuentas beneficiarias 
 *
 * @class BusquedaCuentasBeneficiariasContratos
 * @since 31/03/2023
 * @author NTTDATA
 * @version 1.0
 */
export interface CuentasBeneficiariasRespuesta {
    /** Variable para el contrato*/
    numContrato:string; 
    //Variable para la cuenta del cliente
    cuentaBeneficiaria:string;
    
}