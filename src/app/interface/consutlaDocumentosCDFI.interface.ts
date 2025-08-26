/**
 * @description Modelo de datos para documentos CFDI
 * @since 19/06/2023
 * @author NTTDATA
 * @version 1.0
 */
export interface ConsultaDocumentosCFDIRespuesta {
  //Variable para el contrato
  contratoConfirmingCfdi:string;
  //Variable para la fecha de inicio
  fechaInicioCfdi:Date;
  //Variable para la fecha final
  fechaFinCfdi:Date;
  //Variable para el número de documento
  numDocumentoClienteCfdi:string;
  //Variable para el número de cliente
  bucCliente:string;
  //Variable para el proveedor
  proveedor:string;
  //Variable para el importe
  importe:string;
  //Variable para el importe
  estatus:string;
  //Variable para la fecha de inicio
  fechavencimiento:Date;
  //Variable para la fecha de inicio
  fechaEmi:Date;
}