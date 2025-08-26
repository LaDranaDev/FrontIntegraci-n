export interface NotificacionesModel {
  bandActivo: number;
  asunto: string;
  clveTmpl: string;
  destinatarios: string[] | null;
  idNoti?: number;
  mensaje: string;
  nombreNoti: string;
  tipoDest: string;
  tipoNoti: string;
}
