import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ConsultaClaveAbaService } from 'src/app/services/administracion/consulta-clave-aba.service';
import { ClaveAbaRespuesta } from 'src/app/interface/claveAbaRespuesta.interface';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Router } from '@angular/router';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consulta-aba',
  templateUrl: './consulta-aba.component.html',
  styleUrls: ['./consulta-aba.component.css']
})
export class ConsultaAbaComponent implements OnInit, OnDestroy {


  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  //Variable para las claves
  claves = 1;
  // Variable para guardar la informacion de busqueda
  claveRequest: ClaveAbaRespuesta;

  /**
  * Datos para llenar la tabla de claves
  */
  tablaclaves: ClaveAbaRespuesta[] = []
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de claves
   * @type {FormGroup}
   * @memberOf GestionclavesComponent
  */
  gestionClavesForm!: UntypedFormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los claves */
  submittedSearchClaves = false;
  pageSize: number = 0;
  tabla: any;
  returnedArray!: any;

  clave = {
    codigoTransfer: "",
    nombre: "",
    catalogo: "ABA",
  }

  /**
  * @description Objeto para el evento de paginacion
  * con el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPagination: IPaginationRequest;

  /**
  * @description claveAba del clave
  * @type {string}
  * @memberOf GestionclavesComponent
  */
  codigoTransfer: String = '';

  /**
  * @description descripcion del clave
  * @type {string}
  * @memberOf GestionclavesComponent
  */
  nombre: string = '';

  /**
    * @description descripcion de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';
  clickSuscliption: Subscription | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionClavesService: ConsultaClaveAbaService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private modalService: BsModalService,
    private router: Router,
    private translate: TranslateService,
    private comunService: ComunesService,

  ) {
    this.claveRequest = {
      codigoTransfer: '',
      nombre: '',
      catalogo: "ABA",
    }

    this.usuarioActual = localStorage.getItem('UserID');
    this.gestionClavesForm = this.initializeForm();
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }

  /**
  * Metodo para poder inicializar el formulario
  */
  private initializeForm() {
    return this.formBuilder.group({
      codigoTransfer: [''],
      nombre: [''],
    })
  }

  ngOnInit(): void {

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 12) {
        this.eventCleanAba();
        this.getConsultaclaves(this.fillObjectPag(this.page, this.rowsPorPagina));      }
    });

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
    this.objPagination.page = numPage,
      this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  /**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  *
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaclaves(objPaginacion: IPaginationRequest) {

    try {
      await this.gestionClavesService.getListaClaves(this.clave, objPaginacion).then(
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
        "",
        this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
        'info',
        '',
        '',
      );
    }
  }

  /**
  * Metodo getter para la validacion de formulario
  * en la vista
  */
  get formControlSearchclaves() {
    return this.gestionClavesForm.controls;
  }

  /**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
  eventCleanAba() {
    /** Se reinicia el formulario de busqueda */
    this.gestionClavesForm = this.initializeForm();
    this.page = 0;
    //this.getConsultaclaves(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  eventoConsultarAba() {
    const codigoTransfer = this.gestionClavesForm.value.codigoTransfer;
    const nombre = this.gestionClavesForm.value.nombre;
    const catalogo = this.clave.catalogo;
    const clave = {
      "codigoTransfer": codigoTransfer,
      "nombre": nombre,
      "catalogo": catalogo,
    }

    this.page = 0
    this.gestionClavesService.getListaClaves(clave, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
      (result: any) => {
        this.resultRequest(result);
        this.globals.loaderSubscripcion.emit(false);
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
      this.open(
        '',
        this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
        'info',
        'ERR003',
        '',
      );
    }

    if (result.totalElements === 0) {
      this.banderaBtnExportar = false;
    } else {
      this.banderaBtnExportar = true;
    }

  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionclavesComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const codigoTransfer = this.gestionClavesForm.value.codigoTransfer;
    const nombre = this.gestionClavesForm.value.nombre;
    const catalogo = this.clave.catalogo;
    const clave = {
      "codigoTransfer": codigoTransfer,
      "nombre": nombre,
      "catalogo": catalogo,
    }
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (codigoTransfer === '' && nombre === '') {
      await this.getConsultaclaves(this.fillObjectPag(this.page, this.rowsPorPagina));
    }else if(nombre){
      this.gestionClavesService.getListaClaves(clave, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */

  open(titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true 
    }
    );
  }

  /**
  *
  * Abrir el modal de error
  */
  openModalError(titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true 
    }
    );
  }

  /**
  * @description Evento al dar click en exportar
  */
  showConfirmExportar(template: TemplateRef<any>) {
    this.modalService.show(template);
  }

  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte pdf
  */
  async generarReporteExcelCsv() {
    const codigoTransfer = this.gestionClavesForm.value.codigoTransfer;
    const nombre = this.gestionClavesForm.value.nombre;
    const catalogo = this.clave.catalogo;
    const clave = {
      "codigoTransfer": codigoTransfer,
      "nombre": nombre,
      "catalogo": catalogo,
    }

    try {
      await this.gestionClavesService.getReporteExcel(clave).then(
        async (result: any) => {
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', this.translate.instant('administracion.consultaABA.errorExcel'), 'error');
    }
  }

  /**
 * Metodo que valida que se ingresen solo mayusculas, minusculas, numeros y comas, en caso de que se quieran ingresar datos diferentes no se permitira
 */
  onlyAlphaNumberAndComa(event: KeyboardEvent) {
    this.fc.alphaNumberAndComaOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas, numeros y comas en el input text
   */
  pasteOnlyAlphaNumberAndComa(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumberAndComaOnlyPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
  * Metodo que valida que se ingresen solo mayusculas, minusculas y numeros, en caso de que se quieran ingresar datos diferentes no se permitira
  */
  onlyAlphaNumber(event: KeyboardEvent) {
    this.fc.alphaNumberOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas y numeros en el input text
   */
  pasteOnlyAlphaNumber(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

}
