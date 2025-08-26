import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';
import {
  ConsultaValidacionesCanalService,
  GenericResponseCatalogs,
} from 'src/app/services/administracion/consulta-validaciones-canal.service';
import { ValidacionesCanalRespuesta } from 'src/app/interface/consultaValidacionesCanal.interface';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consulta-validaciones-canal',
  templateUrl: './consulta-validaciones-canal.component.html',
})
export class ConsultaValidacionesCanalComponent implements OnInit {
  //Lista para la información del canal
  tablaValidacionesCanal: ValidacionesCanalRespuesta[] = [];
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** variable de control para saber si se realizoel submit del search */
  submittedClaveSearch = false;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  //Para indicar la parte de exportar
  banderaBtnExportar: boolean = true;

  //Variables para la información de los select
  catLayout: GenericResponseCatalogs[] = [];
  catProductos: GenericResponseCatalogs[] = [];
  catNumCampo: GenericResponseCatalogs[] = [];
  catNombreCampo: GenericResponseCatalogs[] = [];
  catCanales: GenericResponseCatalogs[] = [];

  /**
   * @description Formulario para la busqueda de consulta
   * @type {FormGroup}
   * @memberOf GestionComponent
   */
  consultaValidacionesForm: UntypedFormGroup;
  clickSuscliption: Subscription | undefined;

  /** variable de control para saber si se realizo el submit de la consulta a los bancos */
  pageSize: number = 0;
  tabla: any[] = [];
  returnedArray!: any;
  canal = {
    producto: '',
    numCampo: '',
    layout: '',
    nombreCampo: '',
  };

  // /**
  // * @description producto de la validacion del canal
  // * @type {string}
  // * @memberOf ConsultaValidacionesCanalComponent
  // */
  // product: any;

  /**
   * @description producto de la validacion del canal
   * @type {string}
   * @memberOf ConsultaValidacionesCanalComponent
   */
  producto: any;

  /**
   * @description numCampo de la validacion del canal
   * @type {string}
   * @memberOf ConsultaValidacionesCanalComponent
   */
  numCampo: String = '';

  /**
   * @description layout de la validacion del canal
   * @type {string}
   * @memberOf ConsultaValidacionesCanalComponent
   */
  layout: String = '';

  /**
   * @description nombreCampo de la validacion del canal
   * @type {string}
   * @memberOf ConsultaValidacionesCanalComponent
   */
  nombreCampo: String = '';

  /**
   * @description Objeto para el evento de paginacion
   * con el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPagination: IPaginationRequest;

  constructor(
    private globals: Globals,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private consultaValidacionesService: ConsultaValidacionesCanalService,
    private monitor: MonitorOperacionesService,
    private translateService: TranslateService,
    private comunService: ComunesService
  ) {
    this.consultaValidacionesForm = this.initializeForm();
    //Se inicializa el objeto pageable
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }

  /**
   * Metodo getter para utilziacion y validacion de formulario
   * en la vista
   */
  get formControlSearch() {
    return this.consultaValidacionesForm.controls;
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      producto: [''],
      numCampo: [''],
      layout: [''],
      nombreCampo: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.selectProducto();
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 17) {
        this.eventClean();
      }
    });
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
   * @descripcion Metodo para poder obtener el listado inicial de catalogos
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */
  private async getConsultaListClaves() {
    try {
      await this.consultaValidacionesService
        .getListaClaves(this.objPagination)
        .then(async (result: any) => {
          /** Se habilita el metodo para proceso el result */
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.tablaValidacionesCanal = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        'Ocurrió un error al obtener el listado de validaciones del canal.',
        'error'
      );
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true 
    });
  }

  resultRequest(result: any) {
    this.tabla = result?.content ? result?.content : [];
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }

    if (result.totalElements === 0) {
      this.banderaBtnExportar = false;
    } else {
      this.banderaBtnExportar = true;
    }
  }

  /**
   * Para la consulta de las validaciones del canal
   */
  async eventoConsultar(): Promise<void> {
    const requestCanal = {
      idProducto: this.consultaValidacionesForm.get('producto')?.value,
      idLayout: this.consultaValidacionesForm.get('layout')?.value as string,
      filtrosAux: {
        numeroCampo: this.consultaValidacionesForm.get('numCampo')
          ?.value as string,
        nombreCampo: this.consultaValidacionesForm.get('nombreCampo')
          ?.value as string,
      },
    };
    if (!requestCanal.idProducto || requestCanal.idProducto === '') {
      this.openModalError(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.seleccionarProducto'
        ),
        'alert',
        this.translateService.instant('modals.sucursales.alerta.campo.sucursal.vacio.VAL001Codigo')
      );
      this.globals.loaderSubscripcion.emit(false);
      return;
    } else if (!requestCanal.idLayout || requestCanal.idLayout === '') {
      this.openModalError(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.seleccionarLayout'
        ),
        'alert',
        this.translateService.instant('modals.sucursales.alerta.campo.direccion.vacio.VAL002Codigo')
      );
      this.globals.loaderSubscripcion.emit(false);
      return;
    }

    const getChanel = await this.consultaValidacionesService.getBusquedaClaves(
      requestCanal,
      this.page
    );
    if (getChanel.code === 'ERRNVC000') {
      this.openModalError(
        this.translateService.instant('gestionValidaciones.msjERRRC00Titulo'),
        this.translateService.instant('gestionValidaciones.msjERRRC00Observacion'),
        'info',
        this.translateService.instant('gestionValidaciones.msjERRRC00Codigo'),
      );

      this.consultaValidacionesForm.controls['layout'].setValue('');
    }
    this.resultRequest(getChanel);
    this.globals.loaderSubscripcion.emit(false);
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionBancosComponent
   */
  async onPageChanged(event: any) {
    this.page = 0;
    this.page = event.page - 1;
    await this.eventoConsultar();
  }

  /**
   *
   * Abrir el modal de error
   */
  openModalError(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
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
   * Open export options
   */
  async openModal(): Promise<void> {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    let resultOptionSelected = await dialogo.afterClosed().toPromise();
    resultOptionSelected === 'xlsx'
      ? (resultOptionSelected = 'xls')
      : resultOptionSelected;
    await this.onClickExportar(resultOptionSelected);
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onClickExportar(typeDocument: 'xls' | 'pdf' | 'csv'): Promise<void> {
    /** Se crea el objeto con la paginacion */
    const canal = {
      idProducto: this.consultaValidacionesForm.get('producto')?.value,
      idLayout: this.consultaValidacionesForm.get('layout')?.value as string,
      filtrosAux: {
        numeroCampo: this.consultaValidacionesForm.get('numCampo')
          ?.value as string,
        nombreCampo: this.consultaValidacionesForm.get('nombreCampo')
          ?.value as string,
      },
    };
    const getExportClaves =
      (await this.consultaValidacionesService.exportarClaves(
        canal,
        typeDocument
      )) as { data: string; code: string; message: string };
    if (getExportClaves.data) {
      /** Se manda la informacion para realizar la descarga del archivo */

      this.fc.convertBase64ToDownloadFileInExport(getExportClaves);
      this.globals.loaderSubscripcion.emit(false);
    } else {
      if (getExportClaves.code === '404') {
        this.openModalError('Error', getExportClaves.message, 'error');
        this.globals.loaderSubscripcion.emit(false);
      } else {
        this.openModalError(
          'Error',
          ' Ocurrió un error al realizar la exportación',
          'error'
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    }
  }

  //Metodo para el botón de limpiar
  eventClean() {
    this.submittedClaveSearch = false;
    this.consultaValidacionesForm = this.initializeForm();
    this.page = 0;
    this.tabla = [];
    this.banderaHasRows = false;
  }

  //Función para el select de los layouts
  async getLayouts() {
    const productSelected =
      this.consultaValidacionesForm.get('producto')?.value;
    const getLayouts = await this.consultaValidacionesService.getLayouts(
      productSelected
    );
    this.catLayout = Array.isArray(getLayouts) ? (getLayouts as any[]) : [];
    this.globals.loaderSubscripcion.emit(false);
    if (!Array.isArray(getLayouts)) {
      const getErr = getLayouts as { code: string; type: string };
    }
  }

  //Funcion para el select de los productos
  async selectProducto(): Promise<void> {
    const getProduct =
      (await this.consultaValidacionesService.getProductos()) as [
        {
          idCatalogo: number;
          descripcionCatalogo: string;
        }
      ];
    this.catProductos = getProduct;
    this.globals.loaderSubscripcion.emit(false);
    /* this.consultaValidacionesService.getProductos().then((descripcionCatalogo:any)=>{
    }) */
  }

  //Funcion para el select de los número de campo
  async getFieldNumber() {
    const getFieldNum = await this.consultaValidacionesService.getnumCampo(
      this.consultaValidacionesForm.get('producto')?.value as string,
      this.consultaValidacionesForm.get('layout')?.value as string
    )as any;
    await this.getFieldName();
    this.catNumCampo = getFieldNum['code'] === 'ERRNVC000' ? []: getFieldNum as GenericResponseCatalogs[];
    this.globals.loaderSubscripcion.emit(false);
    /* this.consultaValidacionesService
    .getnumCampo(this.canal.producto, this.canal.layout)
    .then((descripcionCatalogo: any) => {
      this.CatnumCampo = descripcionCatalogo.descripcionCatalogo;
      this.globals.loaderSubscripcion.emit(false);
    }); */
  }

  //Funcion para el select de los nombres de campo
  async getFieldName(): Promise<void> {
    const getChan = await this.consultaValidacionesService.getnombreCampo(
      this.consultaValidacionesForm.get('producto')?.value as string,
      this.consultaValidacionesForm.get('layout')?.value as string
    ) as any;
    this.catNombreCampo = getChan['code'] === 'ERRNVC000' ? [] : getChan as GenericResponseCatalogs[];
    this.globals.loaderSubscripcion.emit(false);
    /* this.consultaValidacionesService
      .getnombreCampo(this.canal.producto, this.canal.layout)
      .then((descripcionCatalogo: any) => {
        this.catNombreCampo = descripcionCatalogo.descripcionCatalogo;
        this.globals.loaderSubscripcion.emit(false);
      }); */
  }

  async getCanal(): Promise<void> {
    const requestCanal = {
      idProducto: this.consultaValidacionesForm.get('producto')?.value,
      idLayout: this.consultaValidacionesForm.get('layout')?.value as string,
      filtrosAux: {
        numeroCampo: this.consultaValidacionesForm.get('numCampo')
          ?.value as string,
        nombreCampo: this.consultaValidacionesForm.get('nombreCampo')
          ?.value as string,
      },
    };
    const getChanel = await this.consultaValidacionesService.getBusquedaClaves(
      requestCanal
    );
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
}
