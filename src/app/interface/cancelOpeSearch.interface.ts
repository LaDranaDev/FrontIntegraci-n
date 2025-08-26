export interface ArchivoModel {
    buc: string,
    nomArchivo: string,
    estatus: string,
    idEstatus: number,
    codCliente: string,
    idRegistro: number,
    idOperacion: number,
    ctaCargo: string,
    ctaAbono: string,
    producto: string,
    canal: string,
    referencia: string,
    importe: number,
    bandera: boolean,
    movimiento: number
}

export interface BuscarArchivoResponse {
    content: ArchivoModel[],
    pageable: Pageable,
    totalElements: 47,
    totalPages: 3,
    last: false,
    size: 20,
    number: 0,
    numberOfElements: 20,
    first: true,
    empty: false
}

export interface Pageable {
    pageNumber: number,
    pageSize: number,
    offset: number,
}

export interface RequestBuscarArchivo {
    bucCliente: string,
    nomArchivo: string,
    estatus: string
}

export interface ListStatus {
    id: number,
    valor: string
}

export interface RequestCancelOpe{
    bucCliente: number;
}

export interface RequestCancelAll{
    bucCliente: string,
    nomArchivo: string,
    estatus: number
}