/**
 * @description Modelo de datos para la consulta de los  
 * comprobantes del formato de CDMX
 * @export
 * @interface IComprobantesFormatoCdmx
 * @since 03/05/2023
 * @author NTTDATA
 */

export class IComprobantesFormatoCdmx{
    idOperacion: string;
    codCli: string;
    ctaCargo: string;
    ctaAbono: string;
    numOrden: string;
    producto: string;
    nomArch: string;
    referencia: string;
    importe: string;
    fechaCaptura: string;
    intermOrd: string;
    divisa: string;
    divisaOrd: string;
    importeCargo: string;
    intermRec: string;
    nombreBenef: string;
    comentario1: string;
    comentario2: string;
    comentario3: string;
    tipoPago: string;
    modalidad: string;
    estatus: string;
    fechaPresIni: string;
    fechaAplic: string;
    fechaLimitPago: string;
    fechaOper: string;
    numSucursal: string;
    bancoOrdenante: string;
    bancoReceptor: string;
    mensaje: string;
    mensajeOrden: string;
    idEstatus: string;
    idProducto: string;
    vistProd: string;
    tabla: string;
    nombreOrd: string;
    fechaVenc: string;
    referenciaAbono: string;
    referenciaCargo: string;
    canal: string;
    numEmpleado: string;
    bucEmpleado: string;
    nombreEmpleado: string;
    sucTutora: string;
    numTarjeta: string;
    numTarjetaAct: string;
    rfc: string;
    numeroCuenta: string;
    importeSinFormato: number;
    descripcion: string;
    numeMovil: string;
    nomProveedor: string;
    tipoOperacion: string;
    cveProveedor: string;
    tipoPerJuridica: string;
    numFolio: string;
    codRegistro: string;
    horarioProg: string;
    idMensaje: string;
    idCliente: string;
    fechaIni: string;
    fechaF: string;
}