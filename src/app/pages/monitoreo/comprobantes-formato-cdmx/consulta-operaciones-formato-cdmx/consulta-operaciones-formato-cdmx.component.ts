import { IComprobantesFormatoCdmx } from 'src/app/interface/comprobantesFormatoCDMX.interface';
import { ComprobanteFormatoCDMXService } from 'src/app/services/monitoreo/comprobantes-formato-cdmx.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consulta-operaciones-formato-cdmx',
  templateUrl: './consulta-operaciones-formato-cdmx.component.html',
})
export class ConsultaOperacionesFormatoCdmxComponent implements OnInit {
  //Variable para los comprobantes
  comprobante: any;

  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks3: boolean = true;
  showDirectionLinks3: boolean = true;
  //Variable para los comprobantes
  comprobantes = 1;

  //Propiedad para llenar la tabla y pasar parametros a los otros endpoint
  //objcomprobante:IComprobantesFormatoCdmx;

  /**
   * Datos para llenar la tabla de comprobantes
   */
  listaOperaciones: IComprobantesFormatoCdmx[] = [];
  /**
   * @description Formulario para la busqueda de comprobantes
   * @type {FormGroup}
   * @memberOf ComprobantesFormatoCdmxComponent
   */
  comprobanteFormatoForm!: UntypedFormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los comprobantes*/
  submittedSearchComprobantes = false;
  pageSize: number = 0;
  returnedArray!: any;

  payloadComprobante: any = {
    lineaCaptura: "",
    fecha: "",
    importe: 0.0,
    referencia: "",
    tramaAdicionalesEntrada: "",
    idReg: "",
  };
  /**
   * @description Objeto para el evento de paginacion
   * con el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPagination: IPaginationRequest;

  // Variables para la información del comprobante
  buc: String = '';
  nombreArchivo: String = '';
  contrato: String = '';
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();
  cuentaCargo: String = '';
  lineaCaptura: String = '';
  idmovimientoH2H: String = '';

  //Variables para obtener la información de los totales
  totalArchivos: any;
  importeGlobal: any;
  totalOperaciones: any;
  tipoValor: any ='';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionComprobantesService: ComprobanteFormatoCDMXService,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    private router: Router,
    public datePipe: DatePipe,
    private translate: TranslateService,
  ) {
    this.comprobanteFormatoForm = this.initializeForm();
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      buc: [''],
      contrato: [''],
      cuentaCargo: [''],
      lineaCaptura: [''],
      nombreArchivo: [''],
      estatus: [''],
      tipoOperacion: [''],
      tipo: [''],
      fechaInicial: [''],
      fechaFinal: [''],
      idReg: [''],
    });
  }

  //Metodos que se ejecutarán al momento de iniciar
  ngOnInit(): void {
    this.eventoConsultar();
    this.eventoCalculaTotal();
    this.getTipoValor();
  }

  /**
   * Metodo para distribuir el resultado de la respuesta
   * @param result resultado
   */
  resultRequest(result: any) {
    this.listaOperaciones = result.listaOperaciones;
    this.totalElements = result.totalOperaciones ? result.totalOperaciones : 0;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPagination.page = numPage;
    this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  /**
   * Metodo para consultar la información
   */
  eventoConsultar() {
    this.comprobante =
      this.gestionComprobantesService.getSaveLocalStorage('comprobante');
    this.page = 0;
    this.gestionComprobantesService
      .getBusquedaComprobantes(this.comprobante)
      .then((result: any) => {
        if (result.code === 'VALFEC01') {
          this.open('Error', result.message, 'error');
        } else {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
        this.resultRequest(result);
        this.globals.loaderSubscripcion.emit(false);
      });
  }

  async onPageChanged(event: any) {
    this.page = event.page;
    this.gestionComprobantesService.getBusquedaComprobantes(this.comprobante).then((result: any) => {
      if (result.code === 'VALFEC01') {
        this.open('Error', result.message, 'error');
        this.globals.loaderSubscripcion.emit(false);
      } else {
        this.resultRequest(result);
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  /**
   * Metodo para consultar la información
   */
  eventoCalculaTotal() {
    this.gestionComprobantesService
      .getCalculoTotales(this.comprobante)
      .then((result: any) => {
        this.totalArchivos = result.totalArchivos;
        this.importeGlobal = result.importeGlobal;
        // this.totalOperaciones = result.totalOperaciones
        this.globals.loaderSubscripcion.emit(false);
      });
  }

  //Función para obtener el tipo valor
  getTipoValor() {
    if(this.comprobante.lineaCaptura !== ''){
      this.gestionComprobantesService
      .obtieneValor(this.comprobante)
      .then((result: any) => {
        this.tipoValor = result.conceptoValor;
        this.globals.loaderSubscripcion.emit(false);
      });
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */

  open(
    titulo: string,
    contenido: string,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }

  /**
   *
   * Abrir el modal de error
   */
  openModalError(
    titulo: string,
    contenido: string,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }

  /**
   * Metodo para poder realizar
   */
  regresarInicio() {
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/monitoreo/comprobantesFormatoCDMX']);
  }

  /**
   * Función para traer la pantalla de detalle operacion
   * dependiendo el número de cliente
   */
  detalleOperacion(operacion: IComprobantesFormatoCdmx) {
    var detalleOperacion = {
      idOperacion: operacion.idOperacion,
      vistProd: operacion.idProducto,
    };
    this.gestionComprobantesService.setSaveLocalStorage(
      'detalleOperacion',
      detalleOperacion
    );
    this.router.navigate(['/monitoreo/detalleOperacionFormatoCDMX']);
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onExportar() {
    /** Se crea el objeto con la paginacion */
    try {
      await this.gestionComprobantesService
        .exportar(this.comprobante)
        .then(async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
            } else {
              this.open(
                'Error',
               this.translate.instant(' modals.error.exportacion'),
                'error'
              );
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant(' modals.error.exportacion'),
        'error'
      );
    }
  }


  mockGetTipoValor() {
    let response = JSON.parse(
      '{"cdmxBean":"","codError":"","conceptoValor":"1","importeTotal":"","listaOperaciones":"","listaTipoPago":"","msgError":"","parametrosAdicionalesComprobante":"","totalArchivos":"","totalOperaciones":""}'
    );
    return response;
  }

  selProd(event: any) {
    const { checked, value } = event.target
    if (checked) {
        this.listaOperaciones.map((item: any) => {
          if (item.idOperacion == value) {
            const importe = item.importe.replace(/[$,]/g, "");;

            this.payloadComprobante = {
              lineaCaptura: item.referenciaAbono,
              fecha: item.fechaAplic,
              importe: Number(importe).toFixed(2),
              referencia: item.referencia,
              tramaAdicionalesEntrada: "",
              idReg: item.idOperacion
            }
          }
        });
      } else {
        this.payloadComprobante = {
          lineaCaptura: "",
          fecha: "",
          importe: 0.0,
          referencia: "",
          tramaAdicionalesEntrada: "",
          idReg: "",
        };
      }
  }

  async generarComprobante():Promise<any>{
    if (this.payloadComprobante.idReg === "") {
      this.open(
        'INFO',
        "No existen registros seleccionados para generar comprobante.",
        'info'
      );
      return false
    }
    try {


      const result = await this.gestionComprobantesService.createVaucher(this.payloadComprobante);
      if (result.data) {
        /** Se manda la informacion para realizar la descarga del archivo */
        this.fc.convertBase64ToDownloadFileInExport(result);
      } else {
        if (result.code === '404') {
          this.open('Error', result.message, 'error');
        } else {
          this.open(
            'Error',
            this.translate.instant('modals.error.exportacion'),
            'error'
          );
        }
      }
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
    }
  }
}
