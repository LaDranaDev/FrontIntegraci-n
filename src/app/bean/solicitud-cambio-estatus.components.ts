export class DatosContratoRequest {
    codigoCliente       : string;
    descEstatus      : string;
    razonSocial         : string;
    cuentaEje           : string;
    numContrato         : string;
}

export class ConsultaOperacionesRequest{
    buc                 : string;
    numeroContrato      : string;
    nombreArchivo       : string;
    tipoOperacion       : string;
    idEstatus           : string;
    bandera             : string;
    banderaSelect?       : Boolean;
}

export class InsCambioEstatusRequest{
    contrato            : string;
    buc                 : string;
    accion              : string;
    opcEnvio            : string;
    asignarEstatus      : string;
    seleccion           : any[];
    datosBita           : any[];
    filtrosOperaciones  : ConsultaOperacionesRequest;
    filtrosOperaciones1  : any[];

}

export class ListEstatusResponse{
    key                 : string;  
    value               : string;
}

export class TablaDatos{
    bandera             : string;
    banderaCambio       : string;
    buc                 : string;
    canal               : string;   
    ctaAbono            : string;
    ctaCargo            : string;
    estatus             : string;
    idEstatus           : string;
    idRegistro          : string;
    importe             : string;
    movimiento          : string;
    nombreArchivo       : string;
    producto            : string;
    referencia          : string;
}