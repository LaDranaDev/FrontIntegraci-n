export class DatosBuzonRequest {
    nombreArchivo: String;
    tipoArchivo: string;
    fechaInicio: string;
    fechaFin:string;
    codigoCliente: string;
    contrato: string;
    numpagina:string;
    tamanioPagina:string;
    idContrato: string;
}

export interface DatosBuzonResponse {
    nombreArchivo: String;
    fechaRegistro: string;
    tipoArchivo: string;
    estatusArchivo:string;
    estatusDescarga: string;
    numpagina:string;
    tamanioPagina: string;
    idContrato: string;
}