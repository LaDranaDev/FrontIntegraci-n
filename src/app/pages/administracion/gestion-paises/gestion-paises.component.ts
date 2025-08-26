import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { PaisRespuesta } from 'src/app/interface/paisRespuesta.interface';
import { GestionPaisesService } from 'src/app/services/administracion/gestion-paises.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-gestion-paises',
  templateUrl: './gestion-paises.component.html',
  styleUrls: ['./gestion-paises.component.css']
})
export class GestionPaisesComponent implements OnInit,OnDestroy {
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksPais: boolean = true;
  showDirectionLinksPais: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  gestionPaisesForm!: UntypedFormGroup;
  /**
  * Datos para llenar la tabla de paises
  */
  tabla: PaisRespuesta[] = [];
  /** Objeto de paises para inicializar busqueda */
  pais = {
    codigoTransfer: "",
    nombre: ""
  }
  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable: IPaginationRequest;
  usuarioActual: string | null = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionPaisesService: GestionPaisesService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    this.gestionPaisesForm = this.initializeForm();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
    this.usuarioActual = localStorage.getItem('UserID');
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

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.eventClean()
    this.getConsultaPaises(this.fillObjectPag(this.page, this.rowsPorPagina));
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
    this.objPageable.page = numPage,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaPaises(objPaginacion: IPaginationRequest) {
    try {
      await this.gestionPaisesService.getListaPaises(this.pais, objPaginacion).then(
        async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
          if (result.totalElements == 0) {
            this.open('', this.translate.instant('modals.sinRegistro'),'info','ERR003');
          }
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modals.Error'), this.translate.instant('modals.error.listado'),'error');
    }
  }

  /**
   * Metodo getter para la validacion de formulario
   * en la vista
  */
  get formControlSearchPaises() {
    return this.gestionPaisesForm.controls;
  }

  /**
   * Metodo que se ejecutara al realizar clcik
   * sobre el boton de clean
   */
  eventClean() {
    //this.submittedSearchBuzon = false;
    /** Se reinicia el formulario de busqueda */
    this.gestionPaisesForm = this.initializeForm();
  }

  /**
   * Se utiliza para realizar la busqueda del formulario
   * Al dar clic en buscar
   */
  public async eventoConsultar() {
    try {
      const codigo = this.gestionPaisesForm.value.codigoTransfer;
      const nombre = this.gestionPaisesForm.value.nombre;
      const pais = {
        "codigoTransfer": codigo,
        "nombre": nombre
      }
      this.page = 0
      this.gestionPaisesService.getListaPaises(pais, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
          if (result.totalElements == 0) {
            this.open('', this.translate.instant('modals.sinRegistro'),'info','ERR003');
          }
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modals.Error'), this.translate.instant('modals.error.listado'),'error');
    }
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
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const codigo = this.gestionPaisesForm.value.codigoTransfer;
    const nombre = this.gestionPaisesForm.value.nombre;
    const pais = {
      "codigoTransfer": codigo,
      "nombre": nombre
    }

    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (codigo === '' && nombre === '') {
      await this.getConsultaPaises(this.fillObjectPag(this.page, this.rowsPorPagina));
    } else {
      this.gestionPaisesService.getListaPaises(pais, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
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
  open(titulo: string, contenido: string, type?:any, errorCode?:string, sugerencia?:string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    }
    );
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.onClickExportarGC(result);
      }
    });
  }

  /**
  *
  * Abrir el modal de error
  */
  openModalError(titulo: String, contenido: String, type?:any, errorCode?:string, sugerencia?:string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    }
    );
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onClickExportarGC(tipoExportacion: string) {
    if (tipoExportacion === 'xlsx') {
      tipoExportacion = 'xls'
    }
    /** Se crea el objeto con la paginacion */
    const codigo = this.gestionPaisesForm.value.codigoTransfer;
    const nombre = this.gestionPaisesForm.value.nombre;
    const pais = {
      "codigoTransfer": codigo,
      "nombre": nombre,
      "user": this.usuarioActual
    }
    try {
      await this.gestionPaisesService.exportarPaises(tipoExportacion, pais).then(
        async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            if (result.code === '404') {
              this.openModalError('Error', result.message,'error');
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.open(this.translate.instant('modals.Error'), this.translate.instant('modals.error.pdf'),'error');
              this.globals.loaderSubscripcion.emit(false);
            }
          }
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modals.Error'), this.translate.instant('modals.error.exportacion'),'error');
    }
  }

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


  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  eveValidateNumberLetras(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

}