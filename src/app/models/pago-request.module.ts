
export class PagoRequest {
    operacion:string | null | undefined;
    divisa:string | null|undefined;
    tipoPago:string | null| undefined;
    estatus:string | null| undefined;
    fechaInicio:Date | null| undefined;
    fechaFin:Date | null| undefined;
    cuentaCargo:string | null| undefined;
    cuentaAbono:string | null| undefined;
    canal:string | null| undefined;
    transactionId:string | null| undefined;
    referenciaCanal:string | null| undefined;
    importe: number| null| undefined;
 }
