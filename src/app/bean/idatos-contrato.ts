/**
 * @description Modelo de datos para mostrar
 * la informaicon de datos del contrato
 * 
 * @export
 * @interface IDatosContrato
 * @since 09/08/2022 
 * @author Felipe Cazarez
 * @version 1.0
 */
export interface IDatosContrato {
    /** Contiene el id del contrato */
    idContrato:string;
    /**  Contiene el codigo del cliente */
    codCliente:string;
    /**  Contiene la razon social */
    razonSocial:string;
    /**  Contiene la cuenta eje */
    cuentaEje:string;
    /**  Estatus del contrato */
    estatusContrato:string;
}
