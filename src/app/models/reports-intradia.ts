export interface ConfigReportIntadia {
  anulaciones: AnulacionesIntradia;
  bandsCobranza: BandsCobranzaIntradia;
  canalesFormatos: CanalesFormatosIntradia;
  clacones: ClaconesIntradia;
  confGeneral: CongifGeneral;
  horarios: {
    horasSel: HoraiosIntradia[];
    lstHoras: HoraiosIntradia[];
  };
}

export interface HoraiosIntradia {
  idCatalogo: number;
  descripcionCatalogo: string;
  estatusActivo?: string;
  estatusFinal?: string;
  valor: string;
}

export interface AnulacionesIntradia {
  indicador: null;
}

export interface BandsCobranzaIntradia {
  signosNegativosMostrar: string;
  cuentaClabeMostrar: string;
  chkCta: boolean;
  chkSigN: boolean;
}

export interface CanalesFormatosIntradia {
  idFormatoMT940D: string;
  idFormatoMT940: string;
  idFormatoMT942: string;
  idFormatoMT940_42: string;
  idFormatoRepCobTXT: string;
  idCanalREPAL: string;
  idCanalSwiftFin: string;
  valorRecArcxCta: string;
  lstCanales: ListaCanales[];
  lstFormatos: ListaFormatos[];
}

export interface ClaconesIntradia {
  lstClacones: LstclaconesIntradia[];
  lstclaconesDisp: LstclaconesIntradia[];
}

export interface CongifGeneral {
  optIntradia: boolean;
  optOperCierre: boolean;
  optConsXDia: boolean;
  optCantidad: string;
  optTipoContenido: string;
  optCanal: null;
  optFormato: null;
  optFormatoConsolidado: null;
  bandCierre: boolean;
  optClaAbono: boolean;
  optClaCarg: boolean;
  banderaProducto: string;
  banderaProdActivo: string;
}

export interface LstclaconesIntradia {
  idCatalogo: number;
  descripcionCatalogo: string;
  estatusActivo?: null;
  estatusFinal?: null;
  valor: string;
}

export interface ListaCanales {
  idCanal: number;
  nombre: string;
  descripcion: string;
  estadoCanal: string;
  idCnt: number;
  estadoSeleccion: string;
}

export interface ListaFormatos {
  idCatalogo: number;
  descripcionCatalogo: string;
  estatusActivo: null;
  estatusFinal: null;
  valor: string;
}

export interface ContratCuentas {
  content: ContentCuentasIntradia[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ContentCuentasIntradia {
  idContratoCuenta: number;
  idContrato: number;
  numCuenta: string;
  tipoCuenta: null;
  bandIntercambiaria: null;
  bandPersonalidad: null;
  titular: null;
  fechaAlta: null;
  terceros: boolean;
  statusCuenta: null;
  codigo: null;
  terceroPropio: null;
  bandActivo: null;
  idDivisa: null;
  idContratoStr: null;
  noComisiones: null;
  bic: null;
  bicAnterior: null;
  actualizaBic: boolean;
}

export interface RequestSvaeConfigIntradia {
  idContrato: number;
  hdnContratoFolio: String;
  anulacionesValor: string;
  confGeneralCobranza: {
    optIntradia: boolean;
    optConsXDia: boolean;
    optCantidad: string;
    optTipoContenido: string;
    optCanal: string;
    optFormato: string;
    optFormatoConsolidado: string;
    bandCierre: boolean;
    optClaAbono: boolean;
    optClaCarg: boolean;
    horarios: HoraiosIntradia[];
    clacones: LstclaconesIntradia[];
  };
  bandsCobranza: {
    signosNegativosMostrar: string;
    cuentaClabeMostrar: string;
  };
}
