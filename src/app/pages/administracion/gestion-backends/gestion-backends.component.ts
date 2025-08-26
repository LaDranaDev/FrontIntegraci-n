import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { BackendRespuesta } from 'src/app/interface/backendRespuesta.interface';
import { GestionBackendService } from 'src/app/services/administracion/gestion-backend.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-backends',
  templateUrl: './gestion-backends.component.html',
  styleUrls: ['./gestion-backends.component.css']
})
export class GestionBackendsComponent implements OnInit, OnDestroy {

  idproto: any

  submittedBuzonSearch = false;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks4: boolean = true;
  showDirectionLinks4: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  gestionBackenForm!: UntypedFormGroup;
  /**
  * Datos para llenar la tabla de paises
  */
  tabla: BackendRespuesta[] = [];
  /** Objeto de paises para inicializar busqueda */
  backend = {
    idBack: "",
    nombre: "",
    dirIp: "",
    protocolo: "",
    bandActivo: 0,
    nombreProtocolo: ''
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
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    /** */
    public gestionBackendService: GestionBackendService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    /** Se inicializa el formulario gestionBackendForm */
    this.gestionBackenForm = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      nameSearch: ['']
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
    this.usuarioActual = localStorage.getItem('UserID');
  }
  listaProtocolo: any

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.onClickClean()
    this.getConsultaBackends(this.fillObjectPag(this.page, this.rowsPorPagina));
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

  private async getConsultaBackends(objPaginacion: IPaginationRequest) {
    try {
      await this.gestionBackendService.getListaBackend(this.backend, objPaginacion).then(
        async (result: any) => {
          await this.gestionBackendService.getListaProtocolo().then(
            async (result: any) => {
              this.listaProtocolo = result;
              this.globals.loaderSubscripcion.emit(false);
            }
          )
          await this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open("Error", this.translate.instant('modals.backend.error.consulta'), 'error', 'ERR000');
    }
  }
  back: any = 6

  resultRequest(result: any) {
    result.content.map((item: any) => {
      const protocolo = this.listaProtocolo.find((element: any) => `${element.idPtcl}` === item.idProtocol)

      item.nombreProtocolo = protocolo ? protocolo.nombre : '';
    })
    
    this.globals.loaderSubscripcion.emit(false);
    if (result.content.length > 0) {
      this.tabla = result.content;
      this.idproto = this.tabla[0].idProtocol
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
    } else {
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
      this.open(
        this.translate.instant(''),
        this.translate.instant('pantalla.gestionBackend.sinDatos'),
        'aviso',
        this.translate.instant('ERR003'),
        this.translate.instant('')
      );
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error'
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    }
    );
  }

  get formControlSearchBackend() {
    return this.gestionBackenForm.controls;
  }

  onClickClean() {
    this.submittedBuzonSearch = false;
    this.gestionBackenForm.reset();
  }

  public async eventoConsultar() {
    this.submittedBuzonSearch = true;

    try {
      const nombre = this.gestionBackenForm.value.nameSearch || '';
      const nomSin = nombre.trimStart();
      this.page = 0
      this.gestionBackendService.getBusquedaBackend(this.backend, nomSin, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        (result: any) => {
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
        'Error',
        this.translate.instant('administracion.gestionCanales.ERGC011.Observacion'),
        'error');
    }
    this.submittedBuzonSearch = false;
  }

  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    // const codigo = this.gestionBackenForm.value.codigoTransfer;
    const nombre = this.gestionBackenForm.value.nombre;
    const backend = {
      // "codigoTransfer": codigo,
      "nombre": nombre
    }

    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (nombre === '') {
      await this.getConsultaBackends(this.fillObjectPag(this.page, this.rowsPorPagina));
    } else {
      this.gestionBackendService.getListaBackend(backend, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    }
  }

  goBackend(dato: any) {
    this.gestionBackendService.setSaveLocalStorage('backend', dato);
    this.router.navigate(['/moduloAdministracion/backend']);
  }

  onClickExportar() {
    this.gestionBackendService.exportarBackend(this.usuarioActual).then(result => {
      this.fc.convertBase64ToDownloadFileInExport(result);
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  addNew() {
    this.gestionBackendService.setSaveLocalStorage('backend', null);
    this.router.navigate(['/moduloAdministracion/backend']);
  }

  cleanNombreBackend(event: any) {
    var valor = event.target.value;
    var regex = /[^A-Za-zÑñáéíóúÁÉÍÓÚ0-9\.,\s\/]/;
    while (regex.test(valor)) {
      valor = valor.replace(regex, "");
    }
    this.gestionBackenForm.controls['nameSearch'].setValue(valor);
  }
}
