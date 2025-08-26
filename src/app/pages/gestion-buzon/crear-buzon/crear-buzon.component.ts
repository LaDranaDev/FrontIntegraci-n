import { MatDialog } from '@angular/material/dialog';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CrearBuzonService } from 'src/app/services/gestion-buzon/crear-buzon-service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { AltaContratosService } from 'src/app/services/admin-contratos/alta-contratos.service';

@Component({
  selector: 'app-crear-buzon',
  templateUrl: './crear-buzon.component.html',
})
export class CrearBuzonComponent implements OnInit, OnDestroy {
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Bandera para determinar si se habilita el boton de guardar*/
  banderaBtnGenerarBuzon: boolean = true;
  /**
   * @description objeto para poder realizar la obtencion de
   * los datos del contrato
   * @type {FormGroup}
   * @memberOf GestionAlarmaConsultaComponent
   */
  datosContrato: DatosCuentaBeanComponent;
  /**Variable para guardar la operacion a ejecutar */
  operacion: string = '';
  /**Variable para guardar el tipo de creacion del buzon */
  tipoCreacion: string = '';
  /**Variable para guardar el protocolo del buzon */
  protocolo: string = '';
  /**Bandera para determinar si se habilita el boton de cargar archivo*/
  banderaBtnCargarArchivo: boolean = true;
  /**Variable para guardar el contenido del archivo seleccionado*/
  archivoSelec: any = null;
  /**Variable para guardar el contenido del archivo*/
  archivo: any = null;
  // Define la referencia al boton de cargar archivo
  @ViewChild('btnCargarArchivo', { static: false })
  // Referencia al boton cargar archivo para resetear su valor despues de una error.
  btnCargarArchivo!: ElementRef;
  /** Variable para identificar si se muestra la sección de actualizacion en pantalla*/
  banderaShowPanelCertificado: boolean = false;

  constructor(
    private globals: Globals,
    private service: CrearBuzonService,
    private altaContratos: AltaContratosService,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    /** Se inicializa el objeto que contendra los datos del contrato */
    this.datosContrato = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
  }


  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 4) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.limpiarContrato();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


  /*ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }*/

  /**
   * Metodo para poder realizar la obtencion de la informacon
   * del contato del cliente
   */
  async consultaDatosContratoCliente() {
    try {
      if (this.datosContrato.bucCliente != '') {
        await this.altaContratos
          .getContratoByBuc(this.datosContrato.bucCliente)
          .then(async (resp: any) => {
            if (resp.codError == 'OK00000') {
              this.datosContrato.bucCliente = resp.bucCliente;
              this.datosContrato.cuentaEje = resp.cuentaEje;
              this.datosContrato.numContrato = resp.numContrato;
              this.datosContrato.razonSocial = resp.razonSocial;
              this.datosContrato.descEstatus = resp.descEstatus;
              this.datosContrato.idContrato = resp.idContrato;
              this.banderaShowPanelCertificado = true;
              this.buscaConfiguracionBuzon();
            } else if (resp.status === 'OK00001' && resp.result === null) {
              this.open(
                this.translate.instant('planCalidad.msjERR007Titulo'),
                this.translate.instant('planCalidad.msjERR007Observacion'),
                'error',
                this.translate.instant('planCalidad.msjERR007Codigo'),
                this.translate.instant('planCalidad.msjERR007Sugerencia')
              );
              this.limpiarContrato();
            }
            this.globals.loaderSubscripcion.emit(false);
          });
      } else {
        this.open(
          this.translate.instant('solicitudEstadosCuenta.msjINF002Titulo'),
          this.translate.instant('solicitudEstadosCuenta.msjINF002Observacion'),
          'info',
          this.translate.instant('solicitudEstadosCuenta.msjINF002Codigo'),
          this.translate.instant('solicitudEstadosCuenta.msjINF002Sugerencia')
        );
        this.globals.loaderSubscripcion.emit(false);
        this.limpiarContrato();
      }
    } catch (e) {
      this.open(
        this.translate.instant('modal.altaContrato.msjERR000Titulo'),
        this.translate.instant('modal.altaContrato.msjERR000Observacion'),
        'error',
        this.translate.instant('modal.altaContrato.msjERR000Codigo'),
        this.translate.instant('modal.altaContrato.msjERR000Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
      this.limpiarContrato();
    }
  }

  /**
   * Metodo para buscar la configuracion del buzon y en base a esta se verifica si es una creacion o actualizacion de buzon
   */
  private async buscaConfiguracionBuzon() {
    try {
      await this.service
        .findBuzon(this.datosContrato.numContrato)
        .then(async (resp: any) => {
          if (resp.error == 'OK00000') {
            this.operacion = resp.operacion;
            this.tipoCreacion = resp.tipoCreacion;
            this.protocolo = resp.protocolo;
            if (this.operacion == 'A') {
              this.open(
                this.translate.instant('buzon.msjUPDATE_BUZON_WARNTitulo'),
                this.translate.instant('buzon.msjUPDATE_BUZON_WARNObservacio'),
                'aviso',
                this.translate.instant('buzon.msjUPDATE_BUZON_WARNCodigo'),
                this.translate.instant('buzon.msjUPDATE_BUZON_WARNSugerencia')
              );
            }
            if (this.tipoCreacion == 'CC') {
              this.banderaBtnCargarArchivo = false;
            }
            this.banderaBtnGenerarBuzon = false;
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.limpiarContrato();
            this.getMensajeRes(resp.error);
            this.globals.loaderSubscripcion.emit(false);
          }
        });
    } catch (e) {
      this.limpiarContrato();
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('buzon.msjCERT1Titulo'),
        this.translate.instant('buzon.msjCERT1Observacion'),
        'error',
        this.translate.instant('buzon.msjCERT1Codigo'),
        this.translate.instant('buzon.msjCERT1Sugerencia')
      );
    }
  }

  /** Funcion que se utiliza para obtener el mensaje que se mostrara en pantalla al usuario
   *
   * @param code Codigo de error
   * @return Mensaje de respuesta
   */
  getMensajeRes(code: string): {
    titulo: string;
    obser: string;
    type?:
      | 'error'
      | 'info'
      | 'confirm'
      | 'alert'
      | 'help'
      | 'aviso'
      | undefined;
    errorCode?: string | undefined;
    sugerencia?: string | undefined;
  } {
    let response: {
      titulo: string;
      obser: string;
      type?:
        | 'error'
        | 'info'
        | 'confirm'
        | 'alert'
        | 'help'
        | 'aviso'
        | undefined;
      errorCode?: string | undefined;
      sugerencia?: string | undefined;
    } = {
      titulo: '',
      obser: '',
      type: 'info',
      sugerencia: '',
      errorCode: '',
    };
    switch (code) {
      case 'NEG03': {
        this.open(
          this.translate.instant('buzon.msjNEG03Titulo'),
          this.translate.instant('buzon.msjNEG03Observacion'),
          'error',
          code,
          this.translate.instant('buzon.msjNEG03Sugerencia')
        );
        break;
      }
      case 'NEG02': {
        this.open(
          this.translate.instant('buzon.msjNEG02Titulo'),
          this.translate.instant('buzon.msjNEG02Observacion'),
          'error',
          code,
          this.translate.instant('buzon.msjNEG02Sugerencia')
        );
        break;
      }
      case 'INFO00S1': {
        this.open(
          this.translate.instant('buzon.msjINFOOKTitulo'),
          this.translate.instant('buzon.msjINFOOKObservacion'),
          'info',
          code,
          this.translate.instant('buzon.msjINFOOKSugerencia')
        );
        break;
      }
      case 'UPDATE0001': {
        this.open(
          this.translate.instant('buzon.msjUPDATEOKTitulo'),
          this.translate.instant('buzon.msjUPDATEOKObservacion'),
          'aviso',
          this.translate.instant('buzon.msjUPDATEOKCodigo'),
          this.translate.instant('buzon.msjUPDATEOKSugerencia')
        );
        break;
      }
      case 'ERRZIP02': {
        this.open(
          '',
          this.translate.instant('putget.msjERRZIP02Observacion'),
          'error',
          code,
          this.translate.instant('putget.msjERRZIP02Sugerencia')
        );
        break;
      }
      case 'ERRZIP01': {
        this.open(
          '',
          this.translate.instant('putget.msjERRZIP01Observacion'),
          'error',
          code,
          this.translate.instant('putget.msjERRZIP01Sugerencia')
        );
        break;
      }
      case 'ERRZIP03': {
        this.open(
          '',
          this.translate.instant('putget.msjERRZIP03Observacion'),
          'error',
          code,
          this.translate.instant('putget.msjERRZIP03Sugerencia')
        );
        break;
      }
      case 'SSH_PUBLIC_KEY': {
        this.open(
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYTitulo'),
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYObservacion'),
          'error',
          code,
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYSugerencia')
        );
        break;
      }
      case 'CINV': {
        this.open(
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYTitulo'),
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYObservacion'),
          'error',
          code,
          this.translate.instant('buzon.msjSSH_PUBLIC_KEYSugerencia')
        );
        break;
      }
      case 'LDAPERR': {
        this.open(
          this.translate.instant('buzon.msjLDAPERRTitulo'),
          this.translate.instant('buzon.msjLDAPERRObservacion'),
          'error',
          code,
          this.translate.instant('buzon.msjLDAPERRSugerencia')
        );
        break;
      }
      default: {
        this.open(
          this.translate.instant('buzon.msjLDAPERRTitulo'),
          this.translate.instant('buzon.msjLDAPERRObservacion'),
          'error',
          code,
          this.translate.instant('buzon.msjLDAPERRSugerencia')
        );
        break;
      }
    }
    return response;
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        obser,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  /**
   * Metodo para pode realizar la limpieza del objeto
   * que contendra la informacion del contrato del cliente
   */
  limpiarContrato() {
    this.datosContrato = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    this.banderaBtnCargarArchivo = true;
    this.banderaBtnGenerarBuzon = true;
    this.archivo = null;

    if (this.btnCargarArchivo) {
      this.resetBtnCargarArchivo();
    }
    this.banderaShowPanelCertificado = false;
  }

  /**
   * Evento para solo permitir que el campo de codigo del cliente
   * solo permita valores numerios y el alphabeto
   */
  eventOnlyNumbersAndAlphabetic(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

  /**
   * Evento que se activara al realizar el pegado
   * en el input para el codigo del cliente
   */
  eventOnPage(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Metodo que lee el contenido del archivo seleccionado y lo guarda en una variable para su uso posterior.
   */
  readArchivo(fileEvent: any) {
    this.archivoSelec = fileEvent.target.files[0];
  }

  /**
   * Metodo que crea la configuración del buzon en base las propiedades obtenidas de la busqueda de buzon.
   */
  async createOrUpdateBuzon() {
    if (this.tipoCreacion == 'CC' && this.archivoSelec == null) {
      this.limpiarContrato();
      this.open(
        this.translate.instant('buzon.msjNEG10Titulo'),
        this.translate.instant('buzon.msjNEG10Observacion'),
        'error',
        this.translate.instant('buzon.msjNEG10Codigo'),
        this.translate.instant('buzon.msjNEG10Sugerencia')
      );
    } else if (
      this.archivoSelec.size > 100000 &&
      !this.validateExtensionArchivo(this.archivoSelec.name)
    ) {
      this.open(
        this.translate.instant('buzon.msjCERT1Titulo'),
        this.translate.instant('buzon.msjCERT1Observacion'),
        'error',
        this.translate.instant('buzon.msjCERT1Codigo'),
        this.translate.instant('buzon.msjCERT1Sugerencia')
      );
    } else if (
      this.validateExtensionArchivo(this.archivoSelec.name) &&
      this.archivoSelec.size > 3000000
    ) {
      this.open(
        this.translate.instant('buzon.msjCERT1Titulo'),
        this.translate.instant('buzon.msjCERT1Observacion'),
        'error',
        this.translate.instant('buzon.msjCERT1Codigo'),
        this.translate.instant('buzon.msjCERT1Sugerencia')
      );
    } else {
      if (this.tipoCreacion == 'CC') {
        let formDataArchivo: FormData = new FormData();
        formDataArchivo.append('archivo', this.archivoSelec);
        this.archivo = formDataArchivo;
      }
      try {
        await this.service
          .createOrUpdateBuzon(
            this.datosContrato.numContrato,
            this.protocolo,
            this.operacion,
            this.archivo
          )
          .then(async (resp: any) => {
            let titulo: string = '';
            if (resp.error == 'INFO00S1' || resp.error == 'UPDATE0001') {
              titulo = '';
            } else {
              titulo = 'Error';
              this.limpiarContrato();
            }
            this.getMensajeRes(resp.error);
            this.globals.loaderSubscripcion.emit(false);
          });
      } catch (e) {
        this.limpiarContrato();
        this.open(
          this.translate.instant('buzon.msjWS00001Titulo'),
          this.translate.instant('buzon.msjWS00001Observacion'),
          'error',
          this.translate.instant('buzon.msjWS00001Codigo'),
          this.translate.instant('buzon.msjWS00001Titulo'),
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    }
  }

  /**
   * Metodo que valida la extensión del archivo seleccionado, la extension debe ser .ZIP
   */
  validateExtensionArchivo(nombreArchivo: string): boolean {
    if (nombreArchivo.includes('.zip')) {
      return true;
    }
    return false;
  }

  /**
   * Metodo para resetear el valor del boton de cargar archivo cuando se haya lanzado la petición
   * de crear buzon.
   */
  resetBtnCargarArchivo() {
    this.btnCargarArchivo.nativeElement.value = '';
  }
}
