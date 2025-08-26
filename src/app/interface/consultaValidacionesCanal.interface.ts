/**
 * @description Modelo de datos para
 * la consulta de las validaciones del canal
 *
 * @class ValidacionesCanalRespuesta
 * @since 26/04/2023
 * @author NTTDATA
 * @version 1.0
 */
export interface ValidacionesCanalRespuesta {
  /** Variable para el producto*/
  producto: string;
  /** Variable para el número de campo*/
  numCampo: string;
  /** Variable para el layout*/
  layout: string;
  /** Variable para el nombre de campo*/
  nombreCampo: string;
}

export interface GestionValidacionesCanal {
  numero: string;
  campo: string;
  descripcion: string;
  posInicial: string;
  posFinal: string;
  validacion: string;
  descripcionValidacion: string;
  codigoBack: string;
  codigoCcnbn: string;
  mensaje: string;
  tipoCampo: string;
  id: string;
  idValidacion: string;
  selected?: boolean;
  idProductoCampo?: string;
  idProducto?: string;
  idLayoutCampo?: string;
  idLayout?: string;
  asignado?: string;
  getConsult?: string;
}

export interface NewField {
  clave: string;
  descripcion: string;
  numero: string;
  posInicial: string;
  posFinal: string;
  idValidacion: string;
  tipo: string;
  idProductoCampo?: string;
  idProducto?: string;
  idLayoutCampo: string;
  id: string;
  definicion?: string;
}

export interface SaveValidationField {
  clave: string;
  descripcion: string;
  numero: string;
  posInicial: string;
  posFinal: string;
  idValidacion: string;
  tipo: string;
  idProductoCampo: string;
  idLayoutCampo: string;
}

export interface RequestToSaveEdit {
  clave: string;
descripcion: string
idMsg: string
idValidacion?: string;
}
