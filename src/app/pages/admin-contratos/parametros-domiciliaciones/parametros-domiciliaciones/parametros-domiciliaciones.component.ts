import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Emisora, EmisoraRequest } from 'src/app/bean/parametros-domiciliaciones.component';
import { IPaginationRequest } from '../../../contingencia/request/pagination-request.component';
import { ParametrosDomiciliacionesService } from 'src/app/services/parametros-domiciliaciones/parametros-domiciliaciones.service';

@Component({
  selector: 'app-parametros-domiciliaciones',
  templateUrl: './parametros-domiciliaciones.component.html',
  styleUrls: ['./parametros-domiciliaciones.component.css']
})
export class ParametrosDomiciliacionesComponent implements OnInit {

  constructor(
    private fc: FuncionesComunesComponent,
    private service: ComunesService,
    private globals: Globals,
    private translate: TranslateService,
    public dialog: MatDialog,
    public paramDomiciliacionesService: ParametrosDomiciliacionesService) {
    this.emisora = new Emisora();
    this.emisoraRequest = new EmisoraRequest();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
    this.objP = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }
  usuarioActual: string | null = '';
  datos: any;
  activarRepDom: Boolean = false;
  enviarImpCaroParcial: Boolean = false;
  activarImpCargoPar: Boolean = false;
  emisora: Emisora = {
    emisora: '',
    status: '',
    razonSocial:''
  };
  emisoraRequest: EmisoraRequest;
  tablaDatos: any[] = [];
  request: any;
  O401Response: any;
  estatusReporteDomis: string;
  msjInicial: string;
  codigoError0401: string;
  ERREMINACTIVA: string;

  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;

  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable: IPaginationRequest;
  objP: IPaginationRequest;
  clickSuscliption: Subscription | undefined;

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  ngOnInit(): void {
    this.datos = this.service.datosContrato;
    this.usuarioActual = localStorage.getItem('UserID');
    this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 8) {
        if (this.datos) {
          try {
            this.limpiar();
            this.emisoraRequest.numContrato = this.datos.numContrato;
            this.emisoraRequest.emisora = "";
            await this.getDatos(this.fillObjectPag(this.page, this.rowsPorPagina), 'VIS');
            await this.cargarInformacion();
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
          }
        }
      }
    });
  }

  async cargarInformacion() {
    await this.paramDomiciliacionesService.verificaProducto(this.datos.numContrato).then((resp: any) => {
      this.msjInicial = resp.codigo;
      switch (resp.codigo) {
        case 'ALLOK':
          this.enviarImpCaroParcial = true;
          break;
        case 'NOCONTRATO':
          this.mostrarialog('parametrosDomis.msjINF007Titulo', 'parametrosDomis.msjINF007Observacion', 'alert',
            'parametrosDomis.msjINF007Codigo', 'parametrosDomis.msjINF007Sugerencia');
          this.enviarImpCaroParcial = false;
          break;
        case 'NOAPP':
          this.mostrarialog('parametrosDomis.msjINF006Titulo', 'parametrosDomis.msjINF006Sugerencia', 'alert',
            'parametrosDomis.msjINF006Codigo', 'parametrosDomis.msjINF006Observacion');
          this.enviarImpCaroParcial = false;
          break;
      }
    }).catch(() => {
      this.mostrarialog('parametrosDomis.msjERR001Titulo', 'parametrosDomis.msjERR001Sugerencia', 'error',
        'parametrosDomis.msjERR001Codigo', 'parametrosDomis.msjERR001Observacion');
    }).finally(() => {
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  /** Consulta la emisora ingresada como parametro **/
  consultarEmisora() {
    if (this.emisoraRequest.emisora === "") {
      this.mostrarialog('parametrosDomis.msjINF002Titulo', 'parametrosDomis.msjINF002Sugerencia', 'alert',
        'parametrosDomis.msjINF002Sugerencia', 'parametrosDomis.msjINF002Observacion');
    } else {
      this.getDatos(this.fillObjectPag(0, this.rowsPorPagina), 'CONS');
    }
  }

  async getDatos(objPaginacion: IPaginationRequest, tipoBusqueda: any) {
    this.emisoraRequest.numContrato = this.datos.numContrato;
    this.emisoraRequest.emisora = this.emisoraRequest.emisora.toUpperCase();
    await this.paramDomiciliacionesService.consultarEmisoras(this.emisoraRequest, objPaginacion).then((resp: any) => {
      if(resp.totalElements > 0){
        this.resultRequest(resp, tipoBusqueda);
      }else{
        if(tipoBusqueda === 'CONS'){
          this.mostrarialog('parametrosDomis.msjINF003Titulo', 'parametrosDomis.msjINF003Sugerencia', 'error',
            'parametrosDomis.msjINF003Codigo', 'parametrosDomis.msjINF003Observacion');
          this.emisoraRequest.emisora = '';
          this.emisora.emisora = '';
        }
      }
    }).catch(() => {
      this.mostrarialog('parametrosDomis.msjERR001Titulo', 'parametrosDomis.msjERR001Sugerencia', 'error',
        'parametrosDomis.msjERR001Codigo', 'parametrosDomis.msjERR001Observacion');
    }).finally(() => {
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  resultRequest(result: any, tipoBusqueda: any) {
    this.tablaDatos = result.content;
    this.totalElements = result.totalElements;
    if (tipoBusqueda === 'CONS' && result.totalElements === 0) {
      this.banderaHasRows = false;
    } else {
      if (this.tablaDatos.length) {
        this.estatusReporteDomis = this.tablaDatos[0].reporteDomis;
        if (this.tablaDatos[0].reporteDomis === "A") {
          this.activarRepDom = true;
        } else {
          this.activarRepDom = false;
        }
        if (this.tablaDatos[0].reporteCargoParcial === "A") {
          this.activarImpCargoPar = true;
        } else {
          this.activarImpCargoPar = false;
        }
        this.banderaHasRows = true;
      }
    }
  }

  /**
  * Consulta la transaccion de Domiciliaciones O401 
  * Se verifica que la emisora este activa
  * @param request informacion de la pantalla
  * @param modelo informacion para mostrar en pantalla
  * @return String nombre del jsp a mostrar
  */
  consultaEmisoraDomisTransaccion() {
    // this.codigoError0401 = "";
    this.ERREMINACTIVA = "";
    if (this.validarTxtEmisora() === true) {
      this.paramDomiciliacionesService.consultarO401(this.emisora.emisora).then((resp: any) => {
        this.codigoError0401 = resp.codigoError;
        if (resp.codigoError === "OME0008") {
          this.mostrarialog('parametrosDomis.msjERR001Titulo', 'parametrosDomis.msjERR001Sugerencia', 'error',
            'parametrosDomis.msjERR001Codigo', 'parametrosDomis.msjCEM008Observacion');
          this.emisora.razonSocial = "";
          this.emisora.status = "";
        } else if (resp.codigoError === "ERB41201") {
          this.mostrarialog('parametrosDomis.msjERR001Titulo', 'parametrosDomis.msjERR001Sugerencia', 'error',
            'parametrosDomis.msjERR001Codigo', 'administracion.gestionCanales.ERGC011.Observacion');
          this.emisora.razonSocial = "";
          this.emisora.status = "";
        } else {
          if (resp.fchBajaEmi !== "") {
            this.ERREMINACTIVA = "ERREMINACTIVA";
          }
          if (resp.codigoError === "OK00000") { //OK
            if (resp.fchBajaEmi !== "" && resp.fchBajaEmi.length > 0) {
              this.emisora.status = "Inactiva";
            } else {
              this.emisora.status = "Activa";
            }
            this.emisora.razonSocial = resp.razonSocial;
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      })
    }
  }

  registrar() {
    if (this.validarTxtEmisora() === true) {
      if (this.codigoError0401 === "OK00000" && this.ERREMINACTIVA === "") {
        //Verificar contrato
        this.emisoraRequest.emisora = this.emisora.emisora;
        this.emisoraRequest.razSocial = this.emisora.razonSocial;
        this.paramDomiciliacionesService.existeEmisoraContrato(this.emisoraRequest).then((resp: any) => {
          if (resp.codigo === "0") {
            this.paramDomiciliacionesService.registrarEmisora(this.emisoraRequest).then(() => {
              this.emisoraRequest.emisora = "";
              this.getDatos(this.fillObjectPag(this.page, this.rowsPorPagina), 'VIS');
              this.mostrarialog('parametrosDomis.msjERR001Titulo', 'pantalla.gestion.conexion.observacion.OK00000', 'info',
                'parametrosDomis.msjINF008Codigo', 'parametrosDomis.msjINF008Sugerencia');
              this.emisora.razonSocial = "";
              this.emisora.status = "";
              this.emisora.emisora = "";
            }).catch(() => {
              this.mostrarialog('parametrosDomis.msjERR001Titulo', 'parametrosDomis.msjERR001Sugerencia', 'error',
                'parametrosDomis.msjERR001Codigo', 'parametrosDomis.msjERR001Observacion');
              this.globals.loaderSubscripcion.emit(false);
            });
          } else {
            this.mostrarialog('parametrosDomis.msjINF009Titulo', 'parametrosDomis.msjINF009Sugerencia', 'error',
              'parametrosDomis.msjINF009Codigo', 'parametrosDomis.msjINF009Observacion');
              this.emisora.razonSocial = "";
              this.emisora.status = "";
              this.emisora.emisora = "";
              this.emisoraRequest.emisora = "";
              this.emisoraRequest.razSocial = "";
            this.globals.loaderSubscripcion.emit(false);
          }
        });
      } else {
        this.mostrarialog('parametrosDomis.msjINF009Titulo', 'parametrosDomis.msjINF009Sugerencia', 'alert',
          'INF004', 'No se permite asociar emisoras inactivas al contrato');
        this.emisora.razonSocial = "";
        this.emisora.status = "";
        this.emisora.emisora = "";
        this.globals.loaderSubscripcion.emit(false);
      }

    }
  }

  validarTxtEmisora() {
    if (this.emisora.emisora === undefined || this.emisora.emisora === "" || this.emisora.emisora.length !== 5) {
      this.mostrarialog('parametrosDomis.msjINF002Titulo', 'parametrosDomis.msjINF002Sugerencia', 'alert',
        'parametrosDomis.msjINF002Sugerencia', 'parametrosDomis.msjINF002Observacion');
      return false;
    }
    return true;
  }

  exportar() {
    this.emisoraRequest.user = this.usuarioActual;
    this.paramDomiciliacionesService.getReport(this.emisoraRequest, this.fPObject(0, this.totalElements)).then((resp => {
      this.fc.convertBase64ToDownloadFileInExport(resp);
      this.globals.loaderSubscripcion.emit(false);
    })).catch(() => {
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
    });
  }

  guardar() {
    var elm = <HTMLInputElement>document.getElementById("activarRepDom");
    var chkImp = <HTMLInputElement>document.getElementById("activarImpCargoPar");
    this.request = {
      data: this.tablaDatos,
      bandRep: elm.checked === false ? 'I' : 'A',
      bandImp: chkImp.checked === false ? 'I' : 'A'
    };
    this.paramDomiciliacionesService.actualizaEmisora(this.request).then((resp => {
      this.globals.loaderSubscripcion.emit(false);
      this.mostrarialog('parametrosDomis.msjERR001Titulo', 'pantalla.gestion.conexion.observacion.OK00000', 'info',
        'parametrosDomis.msjINF008Codigo', 'parametrosDomis.msjINF008Sugerencia');
    })).catch(() => {
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
    });
  }

  onChange(e: any) {
    if (e.target.checked) {
      this.estatusReporteDomis = "A"; //Activado
    } else {
      this.estatusReporteDomis = "I"; // no esta activado
    }
  }

  mostrarialog(titulo: string, sugerencia: string, tipo: string, codigo: string, observacion: string) {
    this.open(
      this.translate.instant(titulo),
      this.translate.instant(sugerencia),
      tipo,
      this.translate.instant(codigo),
      this.translate.instant(observacion)
    );
  }

  limpiar() {

    this.estatusReporteDomis = "";
    this.activarRepDom = false;
    this.activarImpCargoPar = false;
    this.enviarImpCaroParcial = false;
    this.activarImpCargoPar = false;
    this.emisora = new Emisora();
    this.emisoraRequest = new EmisoraRequest;
    this.banderaHasRows = false;
    this.tablaDatos = [];
    this.codigoError0401 = "";
    this.ERREMINACTIVA = "";
    this.page = 0;
  }

  limpiarEmisora() {
    this.emisora = new Emisora();
    this.emisoraRequest = new EmisoraRequest;
    this.codigoError0401 = "";
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

  private fPObject(numPage: number, totalItemsPage: number){
    (this.objP.page = numPage), (this.objP.size = totalItemsPage);
    return this.objP;
  }

  /**
  * @description evento para poder levantar el modal para mostrar los mensajes de sucess o error
  * @param titulo indica si se ejecutara para error o success
  * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?: any, errorCode?: string, sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia)
    });
  }

  /**
  * @description evento que se ejecutara para solo permitir valores
  * numericos
  */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
  }


  async onPageChanged(event: any): Promise<void> {
    this.page = event.page - 1;
    this.objPageable.page = event.page - 1;
    await this.getDatos(this.objPageable, 'CONS');
  }

}
