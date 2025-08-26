import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { AltaContratosService } from 'src/app/services/admin-contratos/alta-contratos.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-alta-contratos',
  templateUrl: './alta-contratos.component.html',
  styleUrls: ['./alta-contratos.component.css']
})
export class AltaContratosComponent implements OnInit, OnDestroy {
  /**
   * @description Objeto para poder realizar la obtencion de
   * los datos del contrato
   * @type {DatosCuentaBeanComponent}
   * @memberOf GestionComprobantesComponent
   */
  /** Se inicializa el objeto que contendra los datos del contrato */
  datospersonales: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
    idEstatus: 0,
  };
  /** Lista de valores del estatus del contrato */
  lstEstatusContrato: any;
  /** Id del estatus default del contrato */
  idEstatusDef: any;
  /** Id del estatus default del contrato */
  idEstatusContratoDef: any;
  /** Datos del contrato */
  datos: any;
  /** Bandera para inabilitar los campos de los datos del contrato */
  bandDisableAll: boolean = false;
  /** Identificador del estatus del contrato*/
  idEstatus: any;
  descEstatus: any;
  isAltaProductos: boolean = false;
  @Output() valueChange = new EventEmitter();

  constructor(
    private globals: Globals,
    private service: AltaContratosService,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comun: ComunesService,
    private router: Router,
  ) { }

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    this.clickSuscliption = this.comun.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.initForm();
      }
    });

  }

  async initForm() {
    this.limpiarContrato();
    this.comun.datosContratoObtenido(false);
    this.comun.otro(false);
    await this.getEstatusContrato();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  /**
   * Metodo para obtener los datos del estatus del contrato
   */
  async getEstatusContrato() {
    try {
      await this.service.getEstatusContrato().then(async (resp: any) => {
        if (resp.codigo == 'OK00000') {
          this.lstEstatusContrato = resp.lstEstatusContrato;
          this.idEstatusContratoDef = resp.idEstatusContratoDef;
          this.idEstatusDef = resp.idEstatusContratoDef;
          this.descEstatus = this.getDescEstatus();
          this.globals.loaderSubscripcion.emit(false);
        }
      });
    } catch (e) {
      this.open(
        this.translate.instant('modals.altacontratos.error'),
        this.translate.instant('modals.altacontratos.error.estatus.contrato'),
        'error',
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  getDescEstatus() {
    for (const item of this.lstEstatusContrato) {
      if (item.idCat === this.idEstatusDef) {
        return item.descripcionCatalogo;
      }
    }
  }

  /**
   * Metodo que busca los datos del contrato mediante el Codigo del Cliente
   */
  async getContratoByBuc() {
    try {
      if (this.datospersonales.bucCliente != '') {
        await this.service
          .getContratoByBuc(this.datospersonales.bucCliente)
          .then(async (resp: any) => {
            if (resp.codError == 'OK00000') {
              this.datospersonales.bucCliente = resp.bucCliente;
              this.datospersonales.cuentaEje = resp.cuentaEje;
              this.datospersonales.numContrato = resp.numContrato;
              this.datospersonales.razonSocial = resp.razonSocial;
              this.datospersonales.descEstatus = resp.descEstatus;
              this.datospersonales.idContrato = resp.idContrato;
              this.datospersonales.idEstatus = resp.idEstatus;
              if (resp.operacionAlta === 'N') {
                this.bandDisableAll = resp.numContrato != null || resp.numContrato !== '' ? true : false;
                this.valueChange.emit(this.datospersonales);
                this.comun.datosContratoObtenido(true);
                this.comun.otro(true);
                this.comun.datos(this.datospersonales);
                this.idEstatus = resp.idEstatus;
                this.idEstatusDef = this.idEstatus;
                localStorage.setItem('bucClient', resp.bucCliente);
              }
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.limpiarContrato();
              this.open(
                this.translate.instant('modals.parametriadicional.info.consulta.cliente.inexistenteTitulo'),
                this.translate.instant('modals.parametriadicional.info.consulta.cliente.inexistenteSuge1'),
                'info',
                this.translate.instant('admonContratos.msjCONT0001Codigo'),
                this.translate.instant('modals.gestionComprobantes.info.consulta.cliente.inexistente.observacion')
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          });
      } else {
        this.open(
          this.translate.instant('admonContratos.msjCTERR14Titulo'),
          '',
          'error',
          this.translate.instant('admonContratos.msjCTERR14Codigo'),
          this.translate.instant('admonContratos.msjCTERR14Observacion'),
        );
      }
    } catch (e) {
      this.open(
        this.translate.instant('modals.altacontratos.error'),
        this.translate.instant('modals.altacontratos.error.consulta.contrato.buc'),
        'error'
      );
      this.datospersonales.bucCliente = "";
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo que busca los datos del contrato mediante el Codigo del Cliente
   */
  async getContratoByCuentaEje() {
    if (!this.checkValidField('cuentaEje', this.datospersonales.cuentaEje))
      return;
    try {
      if (this.datospersonales.cuentaEje != '') {
        await this.service
          .getContratoByCuentaEje(this.datospersonales.cuentaEje, this.datospersonales.bucCliente === '' ? '0' : this.datospersonales.bucCliente)
          .then(async (resp: any) => {

            if (resp.codError === 'OK00000') {
              console.log(this.datospersonales)
              if (resp.operacionAlta === 'N') {
                this.datospersonales.bucCliente = resp.bucCliente;
                this.datospersonales.cuentaEje = resp.cuentaEje;
                this.datospersonales.numContrato = resp.numContrato;
                this.datospersonales.razonSocial = resp.razonSocial;
                this.datospersonales.descEstatus = resp.descEstatus;
                this.datospersonales.idContrato = resp.idContrato;
                this.datospersonales.idEstatus = resp.idEstatus;
                this.bandDisableAll = resp.numContrato != null || resp.numContrato !== '' ? true : false;
                this.valueChange.emit(this.datospersonales);
                this.comun.datosContratoObtenido(true);
                this.comun.otro(true);
                this.comun.datos(this.datospersonales);
                this.idEstatus = resp.idEstatus;
                this.idEstatusDef = this.idEstatus;
              } else {
                resp.bucCliente = this.datospersonales.bucCliente;
                resp.cuentaEje = this.datospersonales.cuentaEje;
                resp.razonSocial = this.datospersonales.razonSocial;
                resp.descEstatus = this.descEstatus;
                resp.idEstatus = this.idEstatusContratoDef;
                this.valueChange.emit(this.datospersonales);
                this.comun.datos(this.datospersonales);
                this.comun.setBandAltaContrato(true);
                this.router.navigateByUrl(`/admin-contratos/productos/${btoa(JSON.stringify(resp))}`);
              }
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.limpiarContrato();
              this.open(
                this.translate.instant('modals.altacontratos.error.cuenta.inexistente.titulo'),
                `${(this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteObserv'))}`,
                'error',
                this.translate.instant('admonContratos.msjCONT0007Codigo'),
                `${(this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteSuge'))}`
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          });
      }
    } catch (e) {
      const msj = `${this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteObserv')}`;
      this.open(
        this.translate.instant('modals.altacontratos.error.cuenta.inexistente.titulo'),
        msj,
        'error',
        this.translate.instant('admonContratos.msjCONT0007Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteSuge'),
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo que busca los datos del contrato mediante el Codigo del Cliente
   */
  async getContratoByNumContrato() {
    if (!this.checkValidField('numContrato', this.datospersonales.numContrato))
      return;
    const getValuenumContrato = this.datospersonales.numContrato;
    try {
      if (this.datospersonales.numContrato != '') {
        await this.service
          .getContratoByNumContrato(this.datospersonales.numContrato)
          .then(async (resp: any) => {
            if (resp.codError == 'OK00000') {
              this.bandDisableAll = resp.numContrato != null || resp.numContrato !== '' ? true : false;
              this.datospersonales.bucCliente = resp.bucCliente;
              this.datospersonales.cuentaEje = resp.cuentaEje;
              this.datospersonales.numContrato = resp.numContrato;
              this.datospersonales.razonSocial = resp.razonSocial;
              this.datospersonales.descEstatus = resp.descEstatus;
              this.datospersonales.idContrato = resp.idContrato;
              this.datospersonales.idEstatus = resp.idEstatus;
              this.valueChange.emit(this.datospersonales);
              this.comun.datosContratoObtenido(true);
              this.comun.datos(this.datospersonales);
              this.idEstatus = resp.idEstatus;
              this.idEstatusDef = this.idEstatus;
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.limpiarContrato();
              this.datospersonales.numContrato = getValuenumContrato;
              this.open(
                this.translate.instant('modals.parametriadicional.info.consulta.numContrato.errTitulo'),
                `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.inexistenteObserv')}`,
                'error',
                this.translate.instant('admonContratos.msjCONT0011Codigo'),
                `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.inexistenteSuge')}`,

              );
              this.globals.loaderSubscripcion.emit(false);
            }
          });
      }
    } catch (e) {
      this.open(
        this.translate.instant('modals.altacontratos.error'),
        this.translate.instant('modals.altacontratos.error.consulta.contrato.numero'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
   */
  validateOnlyNumeros(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Metodo que valida que se peguen solo numeros en los inputs
   */
  pasteOnlyNumeros(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Metodo que valida el tamaño del campo código de cliente, en caso de que sea menor a 8 dígitos lo completa con ceros.
   */
  validateTamanoBuc(event: any) {
    let buc = event.target.value;
    let tamanio = buc.length;
    let relleno = 8 - tamanio;
    this.datospersonales.bucCliente =
      tamanio > 0 ? new Array(relleno + 1).join('0') + buc : buc;
  }

  /**
   * Metodo para pode realizar la limpieza del objeto
   * que contendra la informacion del contrato del cliente
   */
  limpiarContrato() {
    this.datospersonales = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    this.bandDisableAll = false;
    this.idEstatusDef = this.idEstatusContratoDef;
    //localStorage.removeItem('bucClient');
    this.comun.datosContratoObtenido(false);
    this.comun.otro(false);
  }

  /**
   * Metodo para obtener el mensaje de respuesta correspondiente al codigo del servicio.
   *
   * @param codigo Codigo del servicio
   * @returns Mensaje de respuesta
   */
  getMensajeRes(codigo: any) {
    let msg: string = '';
    if (codigo === 'CONT0011') {
      msg = `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.errTitulo'),
        this.translate.instant('modals.altacontratos.error.noexiste.contrato'),
        'info',
        this.translate.instant('admonContratos.msjCONT0011Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.numContrato.inexistenteSuge')}`;
    } else if (codigo === 'CONT0004') {
      msg = `${this.translate.instant('modals.altacontratos.error.excliente.titulo'),
        this.translate.instant('modals.altacontratos.error.excliente.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0004Codigo'),
        this.translate.instant('modals.altacontratos.error.excliente')}`
    } else if (codigo === 'CONT0003') {
      msg = `${this.translate.instant('modals.altacontratos.error.cliente.novalido.titulo'),
        this.translate.instant('modals.altacontratos.error.cliente.novalido.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0003Codigo'),
        this.translate.instant('modals.altacontratos.error.excliente')}`
    } else if (codigo === 'CONT0001') {
      msg = `${this.translate.instant('modals.parametriadicional.info.consulta.cliente.inexistenteTitulo'),
        this.translate.instant('modals.gestionComprobantes.info.consulta.cliente.inexistente.observacion'),
        'info',
        this.translate.instant('admonContratos.msjCONT0001Codigo'),
        this.translate.instant('modals.gestionComprobantes.info.consulta.cliente.inexistente.observacion')}`
    } else if (codigo === 'CONT0007') {
      msg = `${this.translate.instant('modals.altacontratos.error.cuenta.inexistente.titulo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cliente.inexistenteObserv'),
        'info',
        this.translate.instant('admonContratos.msjCONT0007Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteSuge')}`
    } else if (codigo === 'CONT0005') {
      msg = `${this.translate.instant('modals.altacontratos.error.cuenta.cancelada.titulo'),
        this.translate.instant('modals.altacontratos.error.cuenta.cancelada.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0005Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteSuge')}`
    } else if (codigo === 'CONT0006') {
      msg = `${this.translate.instant('modals.altacontratos.error.cuenta.cerrada'),
        this.translate.instant('modals.altacontratos.error.cuenta.cerrada.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0006Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.inexistenteSuge')}`
    } else if (codigo === 'CONT0032') {
      msg = `${this.translate.instant('modals.altacontratos.error.divisa.invalida.titulo'),
        this.translate.instant('modals.altacontratos.error.divisa.invalida'),
        'error',
        this.translate.instant('admonContratos.msjCONT0032Codigo'),
        this.translate.instant('modals.altacontratos.error.divisa.invalida.sugerencia')}`
    } else if (codigo === 'CONT0009') {
      msg = `${this.translate.instant('modals.altacontratos.error.cuenta.invalida.titulo'),
        this.translate.instant('modals.altacontratos.error.cuenta.invalida.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0009Codigo'),
        this.translate.instant('modals.altacontratos.error.cuenta.invalida.sugerencia')}`
      //'modals.altacontratos.error.cuenta.invalida';
    } else if (codigo === 'CONT0008') {
      msg = `${this.translate.instant('modals.altacontratos.error.cuenta.bloqueada.titulo'),
        this.translate.instant('modals.altacontratos.error.cuenta.bloqueada.observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0009Codigo'),
        this.translate.instant('modals.altacontratos.error.cuenta.bloqueada')}`
    } else {
      msg = `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.errTitulo'),
        this.translate.instant('modals.parametriadicional.info.consulta.numContrato.inexistenteObserv'),
        'error',
        this.translate.instant('admonContratos.msjCONT0011Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.numContrato.inexistenteSuge')}`
    }
    return msg;
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  checkValidField(
    field: 'bucCliente' | 'numContrato' | 'cuentaEje',
    value: String
  ): Boolean {
    if (field === 'bucCliente' && value.length !== 8) {
      return false;
    }
    if (field === 'cuentaEje' && value.length !== 11) {
      this.open(
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.Titulo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.novalidSuge'),
        'error',
        this.translate.instant('admonContratos.msjCTERR15Codigo'),
        this.translate.instant('modals.parametriadicional.info.consulta.cuentaEje.sugerencia'),
      );
      return false;
    }
    if (field === 'numContrato' && value.length !== 12) {
      this.open(
        this.translate.instant('numContrato'),
        `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.novalidSuge')}`,
        'error',
        this.translate.instant('admonContratos.msjCTERR16Codigo'),
        `${this.translate.instant('modals.parametriadicional.info.consulta.numContrato.novalidObvserv')}`,
      );
      return false;
    }
    return true;
  }
}
