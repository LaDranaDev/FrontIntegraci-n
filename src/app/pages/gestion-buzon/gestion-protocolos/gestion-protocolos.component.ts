import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { GestionProtocolos } from 'src/app/interface/gestionProtocoloRespuesta.interface';
import { GestionProtocolosService } from 'src/app/services/gestion-buzon/gestion-protocolos.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-gestion-protocolos',
  templateUrl: './gestion-protocolos.component.html',
  styleUrls: ['./gestion-protocolos.component.css']
})
export class GestionProtocolosComponent implements OnInit, OnDestroy {
  /** Variable para indicar en que pagina se encuentra */
  page: number = 1;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 20;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  //Variable para los protocolos
  protocolos = 1;

  /**
  * Datos para llenar la tabla de protocolos
  */
  tablaprotocolos: GestionProtocolos[] = []
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de protocolos
   * @type {FormGroup}
   * @memberOf GestionprotocolosComponent
  */
  gestionProtocolosForm!: UntypedFormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los protocolos */
  submittedSearchprotocolos = false;
  pageSize: number = 0;
  tabla: any[];
  returnedArray!: any;
  protocolo = {
    nombre: "",
    bandActivo: ""
  }

  /**
  * @description Objeto para el evento de paginacion
  * con el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPagination: IPaginationRequest;

  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';

  clickSuscliption: Subscription | undefined;


  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public serviceGestionProtocolos: GestionProtocolosService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private router: Router,
    private translate: TranslateService,
    private comunService: ComunesService,

  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.gestionProtocolosForm = this.initializeForm();
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
      nombre: [''],
    })
  }

  ngOnInit(): void {

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;


      if (codeMenu === 1) {
        try {
          this.eventClean();
          this.loadPage();
          const result = await this.serviceGestionProtocolos.getListaProtocolos(this.protocolo, this.fillObjectPag(this.page, this.rowsPorPagina))

          await this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);

        } catch (e) {
          this.tabla = [];
          /** Se establece el page en el 0 */
          this.page = 1;
          localStorage.setItem('flagBorrarContenido', '');

          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.modificar.contrato.titulo.ERGC002"),
            this.translate.instant('pantalla.modificar.contrato.observacion.ERGC002'),
            'error',
            this.translate.instant('pantalla.modificar.contrato.codigo.ERGC002'),
            this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC002')
          )
        }

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
    this.objPagination.page = numPage - 1,
      this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }


  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.comunService.clickMenu = false;
    if (localStorage.getItem('flagBorrarContenido') !== 'true') {
      localStorage.removeItem('flagBorrarContenido');
    }
  }

  /**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  *
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaprotocolos(objPaginacion: IPaginationRequest) {
    try {
      const result = await this.serviceGestionProtocolos.getListaProtocolos(this.protocolo, objPaginacion)

      await this.resultRequest(result);
      this.globals.loaderSubscripcion.emit(false);

    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 1;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("pantalla.modificar.contrato.titulo.ERGC002"),
        this.translate.instant('pantalla.modificar.contrato.observacion.ERGC002'),
        'error',
        this.translate.instant('pantalla.modificar.contrato.codigo.ERGC002'),
        this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC002')
      )
    }
  }

  /**
  * Metodo getter para la validacion de formulario
  * en la vista
  */
  get formControlSearchprotocolos() {
    return this.gestionProtocolosForm.controls;
  }

  /**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
  eventClean() {
    /** Se reinicia el formulario de busqueda */
    this.gestionProtocolosForm = this.initializeForm();
  }

  eventoConsultar() {
    const nombre = this.gestionProtocolosForm.value.nombre.trim();
    this.page = 1
    this.objPagination.page = this.page - 1;

    if (nombre == '') {
      this.getConsultaprotocolos(this.objPagination);
      return;
    }

    if (!this.validaCadNombreProto(nombre)) {
      this.open(
        this.translate.instant('administracion.protocolos.nombre'),
        this.translate.instant('administracion.general.formatoIncorrecto'),
        'error',
        '',
        ''
      );

      return;
    }

    const protocolo = {
      "nombre": nombre
    }
    localStorage.setItem('flagBorrarContenido', '');

    this.serviceGestionProtocolos.getBusquedaProtocolo(protocolo, this.objPagination).then(
      (result: any) => {
        this.resultRequest(result);
        this.globals.loaderSubscripcion.emit(false);
        if (this.totalElements == 0) {
          this.open(
            'Aviso',
            this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
            'info',
            '',
            ''
          );
        }
      }
    )
  }

  validaCadNombreProto(cadena: string): boolean {
    let cad = cadena.trim();
    if (cad.length > 0) {
      const filter = /[A-Za-zÑñáéíóúÁÉÍÓÚ0-9\.,\$%&{}\s\/:;¿\?¡!#=\-_\|\*\+@]/;
      if (filter.test(cad)) {
        return true;
      }
    }
    return false;
  }

  resultRequest(result: any) {
    this.tabla = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }



  async onPageChange(event: any) {
    this.page = event.page;
    const nombre = this.gestionProtocolosForm.value.nombre;
    const protocolo: any = {
      "nombre": nombre ? nombre : '',
      bandActivo: ""
    }
    this.tabla = [];
    const result = await this.serviceGestionProtocolos.getBusquedaProtocolo(protocolo, this.fillObjectPag(this.page, this.rowsPorPagina))
    this.resultRequest(result);
    this.globals.loaderSubscripcion.emit(false);
    return;
  }


  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */

  open(titulo: String, contenido: String, type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso', code: string, sugerencia: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }


  /**
  *
  * Abrir el modal de error
  */


  /**
  * Metodo para poder realizar la modificacion
  * del protocolo
  */
  viewParametrodelProtocolo(protocolo: any) {
    this.savePage();
    /** Se registra el protocolo a editar en el localstorage */
    this.serviceGestionProtocolos.setSaveLocalStorage('protocolo', protocolo);
    localStorage.setItem('flagBorrarContenido', 'true');

    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/gestionBuzon', 'parametrosProtocolo']);
  }

  /**
  * Metodo para poder agregar un nuevo protocolo
  */
  addProtocolo() {
    this.savePage();
    this.serviceGestionProtocolos.setSaveLocalStorage('protocolo', null);
    this.router.navigate(['/gestionBuzon', 'altaProtocolos']);
  }

  /**
  * Metodo para poder realizar la modificacion
  * del protocolo
  */
  editProtocolo(protocolo: any) {
    this.savePage();
    /** Se registra el protocolo a editar en el localstorage */
    this.serviceGestionProtocolos.setSaveLocalStorage('protocolo', protocolo);
    localStorage.setItem('flagBorrarContenido', 'true');
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/gestionBuzon', 'modificacionProtocolos']);
  }

  /**
    * @description Evento para solo permitir valores del alphabeto,numeros, guión
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
    * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode) == 32 => espacio
    * (keycode == 95) => guión
    */
  onlyAlphabeticAndNumbersAndSomeCaracEsp(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
      || charCode == 32 || (charCode == 45)) {
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

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  onClickExportar() {
    /** Se crea el objeto con la paginacion */
    const nombre = this.gestionProtocolosForm.value.nombre;
    const protocolo = {
      "nombre": nombre,
      "usuario": ""
    }
    this.serviceGestionProtocolos.exportarTodo(protocolo).then((result: any) => {
      if (result.data) {
        /** Se manda la informacion para realizar la descarga del archivo */
        this.fc.convertBase64ToDownloadFileInExport(result);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (result.code === '404') {
          this.open(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Sugerencia'),
          ); this.globals.loaderSubscripcion.emit(false);
        } else {
          this.open(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Sugerencia'),
          ); this.globals.loaderSubscripcion.emit(false);
        }
      }
    });
  }

  loadPage() {
    const page = this.serviceGestionProtocolos.getCurrentPage();
    if (page !== 1) {
      this.page = page;
      this.serviceGestionProtocolos.setCurrentPage(1);
    } else if (this.comunService.clickMenu) {
      this.page = 1;
    }
  }

  savePage() {
    this.serviceGestionProtocolos.setCurrentPage(this.page);
  }

}
