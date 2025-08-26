import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class StateBeanComponent {
    contratoFirmadoProv?: string;
    contratoFirmadoProvEda?: string;
    bucValido?: boolean;
    archivoRiesgo?: boolean;
    
    subscripcionStateBean = new EventEmitter<any>();
    subscripcionConsultasContrato = new EventEmitter<boolean>();
    subscripcionConsultasContratoBSM = new EventEmitter<boolean>();
    subscripcionMostrarCargaArchivo = new EventEmitter<{mostrar: boolean, carga: boolean}>();
    subscripcionMostrarCargaArchivoEda = new EventEmitter<{mostrar: boolean, carga: boolean}>();
    subscripcionMostrarCargaArchivoRiesgo = new EventEmitter<{mostrar: boolean, carga: boolean}>();
    subscripcionMostrarCargaArchivoRiesgoInicial = new EventEmitter<boolean>();
    subscripcionMostrarBtnAgregar = new EventEmitter<boolean>();
    subscripcionRechazo = new EventEmitter<boolean>();
    subscripcionRechazoDict = new EventEmitter<boolean>();
    subscripcionRechazoCCC = new EventEmitter<boolean>();
    subscripcionCambioIdioma = new EventEmitter<boolean>();
    subscripcionRegeneraContrato = new EventEmitter<boolean>();
}
