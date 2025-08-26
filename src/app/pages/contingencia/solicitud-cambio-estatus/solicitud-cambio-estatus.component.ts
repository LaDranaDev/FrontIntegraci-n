import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { DatosContratoRequest, ListEstatusResponse, ConsultaOperacionesRequest, InsCambioEstatusRequest, TablaDatos } from 'src/app/bean/solicitud-cambio-estatus.components';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { SolicitudCambioEstatusService } from 'src/app/services/contingencia/solicitud-cambio-estatus.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalSolicitudCambioEstatusComponent } from 'src/app/components/modals/modal-solicitud-cambio-estatus/modal-solicitud-cambio-estatus.component';


@Component({
  selector: 'app-solicitud-cambio-estatus',
  templateUrl: './solicitud-cambio-estatus.component.html',
  styleUrls: ['./solicitud-cambio-estatus.component.css']
})
export class SolicitudCambioEstatusComponent implements OnInit {

  constructor(private fc: FuncionesComunesComponent, public dialog: MatDialog, private translate: TranslateService, private globals: Globals,
    private solicitudCambioEstatusService: SolicitudCambioEstatusService, private modalService: MdbModalService,
    private comun: ComunesService) {

    this.consultaOperacionesRequest = new ConsultaOperacionesRequest;
    this.insCambioEstatusRequest = new InsCambioEstatusRequest;
    this.datosContrato = new DatosContratoRequest();
    this.listEstatusResponse = [];
    this.listEstatusCResponse = [];


    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }

  //EO -> Estatus Operación           EF -> Estatus Archivo
  //CO -> Cierre Bandera Producto     CF -> Cierre Bandera Archivo
  opcionVista: string;
  opBandera: string;
  banderaBotones: Boolean = false;
  banderaBtnConsultar: Boolean = false;
  banderaTabla: Boolean = false;
  checkAll: Boolean = false;

  banderaCambioEstatusOperacion: Boolean = false;
  banderaCambioEstatusArchivo: Boolean = false;
  banderaCierreProducto: Boolean = false;
  banderaCierreArchivo: Boolean = false;

  datosContrato: DatosContratoRequest;
  consultaOperacionesRequest: ConsultaOperacionesRequest;
  insCambioEstatusRequest: InsCambioEstatusRequest;
  listEstatusResponse: ListEstatusResponse[] = [];
  listEstatusCResponse: ListEstatusResponse[] = [];
  tablaDatos: TablaDatos[] = [];
  tablaDatosModificar: any[] = [];
  nombreArchivo: string;
  estatusArchivo: string;
  estatusOperacion: string;
  bandera: string;

  totalSeleccionados: number = 0;

  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksCuentas: boolean = true;
  showDirectionLinksCuentas: boolean = true;

  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable: IPaginationRequest;

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    this.clickSuscliption = this.comun.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.limpiar();
      }
    });
  }

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

  buscarBuc() {
    if (this.validarCampoCliente() == true) {
      this.solicitudCambioEstatusService.findContratoByBuc(this.datosContrato.codigoCliente).then((resp: any) => {
        if (resp.codError == "OK00000") {
          this.banderaBtnConsultar = false;
          this.banderaBotones = true;
          this.banderaCambioEstatusOperacion = false;
          this.banderaCambioEstatusArchivo = false;
          this.banderaCierreProducto = false;
          this.banderaCierreArchivo = false;
          this.banderaTabla = false;
          this.datosContrato.numContrato = resp.numContrato;
          this.datosContrato.razonSocial = resp.razonSocial;
          this.datosContrato.cuentaEje = resp.cuentaEje;
          this.datosContrato.descEstatus = resp.descEstatus;
        } else if (resp.codError === 'CONT0011') {
          this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
              this.translate.instant('contingencia.msjERR007Observacion'),
              '',
              'info',
              this.translate.instant('contingencia.msjERR007Codigo'),
              this.translate.instant('contingencia.msjERR007Sugerencia')
            ),
          });
          this.limpiar();
        }
      }).catch(() => {
        this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Sugerencia')
          ),
        })
      }).finally(() =>
        this.globals.loaderSubscripcion.emit(false)
      );
    }
  }

  consultar() {
    this.insCambioEstatusRequest = new InsCambioEstatusRequest();
    this.page = 0;
    this.totalSeleccionados = 0;
    this.bandera = "N";
    this.opBandera = "";
    this.estatusOperacion = "0";
    this.consultaOperacionesRequest.buc = this.datosContrato.codigoCliente;
    this.consultaOperacionesRequest.nombreArchivo = this.nombreArchivo;
    this.consultaOperacionesRequest.numeroContrato = this.datosContrato.numContrato;
    this.consultaOperacionesRequest.tipoOperacion = this.opcionVista;
    this.validarEstatus();
    this.getDatos(this.fillObjectPag(this.page, this.rowsPorPagina));
    console.log('thisbanderaCierreArchivo', this.banderaCierreArchivo);
  }

  async getDatos(objPaginacion: IPaginationRequest) {
    this.tablaDatos = [];
    this.tablaDatosModificar = [];
    this.checkAll = false;
    this.estatusOperacion = "0";
    try {
      await this.solicitudCambioEstatusService.consultarOperaciones(this.consultaOperacionesRequest, objPaginacion).then(async (resp: any) => {
        this.resultRequest(resp);
      });
      this.globals.loaderSubscripcion.emit(false);

    } catch (e) {
      this.banderaHasRows = false;
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  resultRequest(result: any) {
    this.tablaDatos = result.content;
    this.totalElements = result.totalElements;
    if (this.tablaDatos.length > 0) {
      this.banderaHasRows = true;
      this.banderaTabla = true;
    } else {
      this.open(
        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
        this.translate.instant('pantalla.monitor.validacion.noInformacion4'),
        'info',
        this.translate.instant('planCalidad.cambioEst.msjINF006Codigo'),
        this.translate.instant('planCalidad.msjErrVaciaObservacion2'),
      );
      this.banderaHasRows = true;
      this.banderaTabla = false;
    }
  }

  onPageChanged(event: any) {
    this.page = event.page - 1;
    this.getDatos(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  validarEstatus() {
    if (this.estatusArchivo != null && this.estatusArchivo === "0") {
      this.consultaOperacionesRequest.idEstatus = "";
    } else {
      this.consultaOperacionesRequest.idEstatus = this.estatusArchivo;
    }
  }

  async setEstatusPantallaCambio() {
    try {
      await this.solicitudCambioEstatusService.findEstatusByTipoOperacion(this.opcionVista).then(async (resp: any) => {
        this.listEstatusResponse = resp;
      });
      await this.solicitudCambioEstatusService.findEstatusCByTipoOperacion(this.opcionVista + 2).then((resp2: any) => {
        this.listEstatusCResponse = resp2;
        this.globals.loaderSubscripcion.emit(false);
      });
      return true;
    } catch (error) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('modal.msjERRGEN0001Titulo'),
          this.translate.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translate.instant('modal.msjERRGEN0001Codigo'),
          this.translate.instant('modal.msjERRGEN0001Sugerencia')
        ),
      });
      this.globals.loaderSubscripcion.emit(false);
      return false;
    }

  }

  // onChangeChkSeleccionar
  check = false
  onChangeChkSeleccionar(e: any, registro: any) {
    let index = this.tablaDatosModificar.indexOf(registro);
    if (e.target.checked) {
      if (index === -1) {
        this.check = true
        let existe = this.tablaDatosModificar.includes(registro);
        registro.banderaCambio = true;
        if (this.tablaDatosModificar.length == 0) {
          this.tablaDatos.map(function (dato) {
            if (dato.idRegistro == registro.idRegistro) {
              dato.banderaCambio = "true";
            }
          });
          this.tablaDatosModificar.push(registro);
        } else if (existe == false) {
          this.tablaDatos.map(function (dato) {
            if (dato.idRegistro == registro.idRegistro) {
              dato.banderaCambio = "true";
            }
          });
          this.tablaDatosModificar.push(registro);
        }
      }
    } else {
      if (index !== -1) {
        this.check = false
        this.tablaDatos.map(function (dato) {
          if (dato.idRegistro == registro.idRegistro) {
            dato.banderaCambio = "false";
          }
        });
        this.tablaDatosModificar = this.tablaDatosModificar.filter((item) => item.idRegistro !== registro.idRegistro);
      }
    }
  }

  onChangeAll(e: any) {
    this.tablaDatos.map(item => {
      this.onChangeChkSeleccionar(e, item);
    });
  }

  abrirDialog() {
    this.modalService.open(ModalSolicitudCambioEstatusComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        bandera: this.opBandera,
        insCambioEstatusRequest: this.insCambioEstatusRequest
      }
    }).onClose.subscribe((r) => {
      if (r) {
        this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(this.translate.instant('planCalidad.msjINF001Titulo'),
            this.translate.instant('planCalidad.msjINF001Observacion'),
            'info',
            this.translate.instant('planCalidad.msjINF001Codigo'),
            this.translate.instant('planCalidad.msjINF001Sugerencia'))
        }
        ).afterClosed().subscribe(() => {
          this.globals.loaderSubscripcion.emit(true);
          setTimeout(() => {
            this.consultar()
          }, 3500)
        });
      }
    });
  }

  enviar() {
    if (this.validarEstatusC() == true) {
      if (this.checkAll === true) {
        this.opBandera = "P";
      } else {
        this.opBandera = "";
      }

      this.insCambioEstatusRequest.contrato = this.datosContrato.numContrato;
      this.insCambioEstatusRequest.buc = this.datosContrato.codigoCliente;
      this.insCambioEstatusRequest.accion = this.opcionVista;
      this.insCambioEstatusRequest.opcEnvio = this.opcionVista;
      this.insCambioEstatusRequest.filtrosOperaciones = {
        buc: this.datosContrato.codigoCliente,
        numeroContrato: this.datosContrato.numContrato,
        nombreArchivo: this.nombreArchivo,
        tipoOperacion: this.opcionVista,
        idEstatus: this.estatusArchivo,
        bandera: this.checkAll ? 'P' : 'P',
      }
      this.insCambioEstatusRequest.asignarEstatus = this.estatusOperacion;

      let datosBita: any | [] = [];
      let seleccion: any[] = [];

      this.tablaDatosModificar.map(item => {
        seleccion.push("" + item.idRegistro);
        datosBita.push("" + item.idRegistro + "||" + item.idEstatus);
      });

      this.insCambioEstatusRequest.seleccion = seleccion;
      this.insCambioEstatusRequest.datosBita = datosBita;

      this.abrirDialog();
    }

  }

  validarCampoCliente() {
    if (this.datosContrato.codigoCliente === "") {
      this.open(
        this.translate.instant('contingencia.msjERR007Titulo'),
        this.translate.instant('contingencia.msjERR007Sugerencia'),
        'info',
        this.translate.instant('contingencia.msjERR007Codigo'),
        this.translate.instant('contingencia.msjERR007Observacion')
      );
      this.limpiar();
      return false;
    }
    else if (this.datosContrato.codigoCliente.length !== 8) {
      this.open(
        this.translate.instant('planCalidad.msjINF004Titulo'),
        this.translate.instant('planCalidad.msjINF004Sugerencia'),
        'error',
        this.translate.instant('planCalidad.msjINF004Codigo'),
        this.translate.instant('planCalidad.msjINF004Observacion')
      );
      this.limpiar();
      return false;
    }
    return true;
  }

  validarEstatusC() {
    if (this.estatusOperacion !== "0") {
      if (this.tablaDatosModificar.length > 0) {
        if (this.checkAll === true) {
          return true;
        }
      } else {
        this.open(
          this.translate.instant('planCalidad.cambioEst.msjINF011xTitulo'),
          this.translate.instant('planCalidad.cambioEst.msjINF011xObservacion'),
          'alert',
          this.translate.instant('planCalidad.cambioEst.msjINF011xCodigo'),
          this.translate.instant('planCalidad.cambioEst.msjINF011xSugerencia')
        );
        return false;
      }
    } else {
      this.open(
        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
        this.translate.instant('planCalidad.cambioEst.msjINF003xObservacion'),
        'alert',
        this.translate.instant('planCalidad.cambioEst.msjINF003xCodigo'),
        this.translate.instant('planCalidad.cambioEst.msjINF003xSugerencia')
      );
      return false;
    }
    return true;
  }

  onCambioEstatusOperacion() {
    this.banderaBotones = false;
    this.banderaCambioEstatusOperacion = true;
    this.banderaBtnConsultar = true;
    this.opcionVista = "EO";
    this.nombreArchivo = "";
    this.estatusArchivo = "0";
    this.setEstatusPantallaCambio();
  }

  onCambioEstatusArchivo() {
    this.banderaBotones = false;
    this.banderaCambioEstatusArchivo = true;
    this.banderaBtnConsultar = true;
    this.opcionVista = "EF";
    this.nombreArchivo = "";
    this.estatusArchivo = "0";
    this.setEstatusPantallaCambio();
  }

  onCierreBanderaProducto() {
    this.banderaBotones = false;
    this.banderaCierreProducto = true;
    this.banderaBtnConsultar = true;
    this.opcionVista = "CO";
    this.nombreArchivo = "";
    this.estatusArchivo = "0";
    this.setEstatusPantallaCambio();
  }

  onCierreBanderaArchivo() {
    this.banderaBotones = false;
    this.banderaCierreArchivo = true;
    this.banderaBtnConsultar = true;
    this.opcionVista = "CF";
    this.nombreArchivo = "";
    this.estatusArchivo = "0";
    this.setEstatusPantallaCambio();
  }

  limpiar() {
    this.totalSeleccionados = 0;
    this.tablaDatos = [];
    this.tablaDatosModificar = [];
    this.banderaHasRows = false;
    this.listEstatusCResponse = [];
    this.listEstatusResponse = [];
    this.consultaOperacionesRequest = new ConsultaOperacionesRequest();
    this.insCambioEstatusRequest = new InsCambioEstatusRequest();
    this.opcionVista = "";
    this.opBandera = "";
    this.checkAll = false;
    this.banderaBotones = false;
    this.banderaTabla = false;
    this.banderaBtnConsultar = false;
    this.banderaCambioEstatusOperacion = false;
    this.banderaCambioEstatusArchivo = false;
    this.banderaCierreProducto = false;
    this.banderaCierreArchivo = false;
    this.datosContrato.codigoCliente = "";
    this.datosContrato.cuentaEje = "";
    this.datosContrato.numContrato = "";
    this.datosContrato.razonSocial = "";
    this.datosContrato.descEstatus = "";
    this.nombreArchivo = "";
    this.estatusArchivo = "0";
    this.estatusOperacion = "0";
    this.bandera = "";
  }

  /**
  * @description evento que se ejecutara para solo permitir valores
  * numericos
  */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
  }

  /**
  * @description evento para poder levantar el modal para mostrar los mensajes de sucess o error
  * @param titulo indica si se ejecutara para error o success
  * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?: any, errorCode?: string, sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia)
    }
    );
  }

  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    (this.objPageable.page = numPage), (this.objPageable.size = totalItemsPage);
    return this.objPageable;
  }

}
