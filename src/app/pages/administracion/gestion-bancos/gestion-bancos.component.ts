import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GestionBancos } from 'src/app/interface/gestionBancosRespuesta.interface';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MatDialog } from '@angular/material/dialog';
import { GestionBancosService } from 'src/app/services/administracion/gestion-banco.services';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Router } from '@angular/router';
import { ExportarBanco } from 'src/app/interface/exportarBancos.interface';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-gestion-bancos',
  templateUrl: './gestion-bancos.component.html',
  styleUrls: ['./gestion-bancos.component.css']
})
export class GestionBancosComponent implements OnInit, OnDestroy {
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 20;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks5: boolean = true;
  showDirectionLinks5: boolean = true;
  //Variable para los bancos
  bancos = 1;

  //Variable para la busqueda
  submittedBuscar = false;
  descBusqueda: string = '';

  /**
  * Datos para llenar la tabla de bancos
  */
  tablaBancos: GestionBancos[] = []
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de bancos
   * @type {FormGroup}
   * @memberOf GestionBancosComponent
  */
  gestionBancosForm: UntypedFormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los bancos */
  submittedSearchBancos = false;
  pageSize: number = 0;
  tabla: any;
  returnedArray!: any;
  banco = {
    claveIdentificacion: "",
    nombre: ""
  }

  tipoOperacion: any[] = [
    {
      "id": "A",
      "nombre": "AMBOS"
    },
    {
      "id": "T",
      "nombre": "TEF"
    },
    {
      "id": "S",
      "nombre": "SPEI"
    },
    {
      "id": "N",
      "nombre": "NINGUNO"
    },
  ]

  /**
  * @description Objeto para el evento de paginacion
  * con el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPagination: IPaginationRequest;

  /**
  * @description claveIdentificacion del banco
  * @type {string}
  * @memberOf GestionBancosComponent
  */
  claveIdentificacion: String = '';

  /**
  * @description Nombre del banco
  * @type {string}
  * @memberOf GestionBancosComponent
  */
  nombre: string = '';

  /**
  * @description Objeto para la exportación
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objExportacion: ExportarBanco;

  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionBancosService: GestionBancosService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private router: Router,
    private comunService: ComunesService,
    private translateService: TranslateService,

  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    /** Se inicia el formulario de busqueda */
    this.gestionBancosForm = this.initializeForm();
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }

  /**
  * Metodo getter para utilziacion y validacion de formulario
  * en la vista
  */
  get formControlSearch() {
    return this.gestionBancosForm.controls;
  }

  /**
  * Metodo para poder inicializar el formulario
  */
  private initializeForm() {
    return this.formBuilder.group({
      claveIdentificacion: [''],
      nombre: [''],
    })
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    //this.initForm();

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.initForm();
      }
    });
  }

  initForm() {
    this.eventClean();
    this.getConsultaBancos(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
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
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  *
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaBancos(objPaginacion: IPaginationRequest) {
    try {
      await this.gestionBancosService.getListaBancos(this.banco, objPaginacion).then(
        async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('menu.sterling.historialBuzon.error'),
        this.translateService.instant('pantalla.gestionDeBancos.errorConsulta'),
        'error',
        '',
        ''
      );
    }
  }

  /**
  * Metodo getter para la validacion de formulario
  * en la vista
  */
  get formControlSearchBancos() {
    return this.gestionBancosForm.controls;
  }

  /**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
  eventClean() {
    /** Se reinicia el formulario de busqueda */
    this.submittedBuscar = false;
    this.gestionBancosForm = this.initializeForm();
    this.page = 0;
  }

  eventoConsultar() {
    const claveIdentificacion = this.gestionBancosForm.value.claveIdentificacion;
    const nombre = this.gestionBancosForm.value.nombre;
    const banco = {
      "claveIdentificacion": claveIdentificacion,
      "nombre": nombre
    }
    this.page = 0
    this.gestionBancosService.getBusquedaBanco(banco, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
      async (result: any) => {
        if (result.totalElements <= 0) {
          this.open(
            this.translateService.instant('buzon.msjINFOOKTitulo'),
            this.translateService.instant('pantalla.gestionBackend.sinDatos'),
            'info',
            '',
            ''
          );
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    )
  }

  resultRequest(result: any) {
    this.tabla = result.content;
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
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionBancosComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const claveIdentificacion = this.gestionBancosForm.value.claveIdentificacion;
    const nombre = this.gestionBancosForm.value.nombre;
    const banco = {
      "claveIdentificacion": claveIdentificacion,
      "nombre": nombre
    }
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (claveIdentificacion === '' && nombre === '') {
      await this.getConsultaBancos(this.fillObjectPag(this.page, this.rowsPorPagina));
    } else {
      this.gestionBancosService.getBusquedaBanco(banco, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    }
  }

  open(titulo: string, contenido: string, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onClickExportar() {
    /** Se crea el objeto con la paginacion */
    const claveIdentificacion = this.gestionBancosForm.value.claveIdentificacion;
    const nombre = this.gestionBancosForm.value.nombre;
    const banco = {
      "claveBanco": claveIdentificacion,
      "nombreBanco": nombre,
      "usuario": ""
    }
    try {
      await this.gestionBancosService.exportarBancos(banco).then(
        async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
            } else {
              this.open('Error', this.translateService.instant('modals.error.exportacion'), 'error');
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', this.translateService.instant('modals.error.exportacion'), 'error');
    }
  }

  /**
  * Metodo para poder realizar la modificacion
  * del banco
  */
  editBanco(banco: any) {
    /** Se registra el buzon a editar en el localstorage */
    this.gestionBancosService.setSaveLocalStorage('banco', banco);
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/moduloAdministracion', 'modificarBancos']);
  }

  /**
  * Metodo para poder agregar un nuevo banco
  */
  addBanco() {
    this.gestionBancosService.setSaveLocalStorage('banco', null);
    this.router.navigate(['/moduloAdministracion', 'altaBancos']);
  }

  searchBancos() {
    this.submittedBuscar = true;
    if (this.gestionBancosForm.invalid) {
      return;
    }
    this.submittedBuscar = false;
  }

  /**
    * @description evento que se ejecutara para solo permitir valores
    * numericos
  */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
  }

  /**
   * @description evento que se ejecutara para solo permitir letras, números, comas, espacios y diagonales
 */
  eventParanumerosLetras(event: any) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

  /**
   * @description Evento para solo permitir valores del alphabeto,numeros,
   * punto, espacio y /
   * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
   * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
   * (keycode >= 48 && keycode <= 57) => numeros
   * (keycode) == 46 => point
   * (keycode) == 32 => espacio
   * (keycode) == 44 => coma
   * (keycode == 47) => /
   */
  onlyAlphabeticAndNumbersAndSomeCaracEsp(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
      || charCode == 46 || charCode == 32 || charCode == 44 || (charCode == 47)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  /**
  * @param event Evento Disable
  * @returns la respuesta del evento
  */
  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
  * Evento para al momento de realizar el pegado
  * en cualquier input este evento no ocurra
  */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

}
