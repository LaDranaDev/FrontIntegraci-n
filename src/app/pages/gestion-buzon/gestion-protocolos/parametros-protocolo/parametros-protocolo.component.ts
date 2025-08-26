import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import {GestionParametros} from 'src/app/interface/gestionParametroRespuesta.interface';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { GestionParametrosdelProtocoloService } from 'src/app/services/gestion-buzon/gestion-parametros.service';

@Component({
  selector: 'app-parametros-protocolo',
  templateUrl: './parametros-protocolo.component.html'
})
export class ParametrosProtocoloComponent implements OnInit, OnDestroy {

  /** Variable para indicar en que pagina se encuentra */
  page: number = 1;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinkspara: boolean = true;
  showDirectionLinkspara: boolean = true;
  //Variable para los parametros
  parametros = 1;

  /**
  * Datos para llenar la tabla de protocolos
  */
  tablaparametros: GestionParametros[] = []

  /**
   * @description Formulario para la busqueda de protocolos
   * @type {FormGroup}
   * @memberOf ParametrosProtocoloComponent
  */
  gestionParametrosForm!: UntypedFormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los protocolos */
  submittedSearchprotocolos = false;
  pageSize: number=0;
  tabla:any;
  returnedArray!: any;
  protocolo: any;

  /**
  * @description Objeto para el evento de paginacion
  * con el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosProtocoloComponent
  */
  objPagination:IPaginationRequest;

  /**
  * @description Nombre del protocolo
  * @type {string}
  * @memberOf GestionprotocolosComponent
  */
  nombreProtocolo: string = '';

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
      public gestionParametrosService: GestionParametrosdelProtocoloService,
      private cd: ChangeDetectorRef,
      private globals: Globals,
      private fc: FuncionesComunesComponent,
      private router: Router,
      private translate: TranslateService
    ) {
      this.usuarioActual = localStorage.getItem('UserID');
      this.gestionParametrosForm = this.initializeForm();
      //Se inicializa el objeto
      this.objPagination = {
        page:this.page,
        size:this.rowsPorPagina,
        ruta:''
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
      this.loadPage();
      this.protocolo = this.gestionParametrosService.getSaveLocalStorage('protocolo');
      this.getConsultaParametos (this.protocolo, this.fillObjectPag(this.page,this.rowsPorPagina));
    }

    ngOnDestroy() {
      if (localStorage.getItem('flagBorrarContenido') == 'true') {
        localStorage.removeItem('flagBorrarContenido');
      }
    }

    /**
     * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
     *
     * @param numPage valor para indicar el numero de la pagina
     * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
    */
    private fillObjectPag(numPage:number,totalItemsPage:number){
      this.objPagination.page = numPage - 1,
      this.objPagination.size = totalItemsPage;
      return this.objPagination;
    }

    /**
    * @descripcion Metodo para poder obtener el listado inicial de los parametros
    *
    * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
    */
    private async getConsultaParametos(parametro: any, objPaginacion:IPaginationRequest){
      try{
        await this.gestionParametrosService.getListaParametro(parametro.idProtocolo, objPaginacion).then(
            async (result:any) => {
              this.resultRequest(result);
              this.globals.loaderSubscripcion.emit(false);
            }
        )
      }catch(e){
        this.tablaparametros = [];
        /** Se establece el page en el 0 */
        this.page=0;
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translate.instant('modal.msjERRGEN0001Titulo'),
          this.translate.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translate.instant('modal.msjERRGEN0001Codigo'),
          this.translate.instant('modal.msjERRGEN0001Observacion')
        );
      }
    }

    /**
    * Metodo getter para la validacion de formulario
    * en la vista
    */
    get formControlSearchprotocolos() {
      return this.gestionParametrosForm.controls;
    }

    /**
    * Metodo que se ejecutara al realizar click
    * sobre el boton de clean
    */
    eventClean() {
      /** Se reinicia el formulario de busqueda */
      this.gestionParametrosForm = this.initializeForm();
      this.page=1;
      this.getConsultaParametos (this.protocolo, this.fillObjectPag(this.page,this.rowsPorPagina));
    }

    resultRequest(result:any){
      this.totalElements = result.totalElements;
      if(this.totalElements > 0){
        this.banderaHasRows = true;
      }else{
        this.banderaHasRows = false;
      }
      this.tablaparametros = result.content;
    }

    open(
      titulo: string,
      obser: string,
      type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
      errorCode?: string,
      sugerencia?: string
    ) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          titulo,
          obser,
          type,
          errorCode,
          sugerencia
        ), hasBackdrop: true
      });
    }

    /**
    * Metodo para poder realizar la modificacion
    * del protocolo
    */
    editParametro(parametro: any) {
      this.savePage();
      /** Se registra el buzon a editar en el localstorage */
      this.gestionParametrosService.setSaveLocalStorage('parametro', parametro);
      /** Se hace el redirect a la vista de alta */
      this.router.navigate(['/gestionBuzon', 'altaParametrosProtocolo']);
    }

    /**
    * Metodo para poder agregar un nuevo protocolo
    */
    addParametro() {
      this.savePage();
      this.gestionParametrosService.setSaveLocalStorage('parametro', null);
      this.router.navigate(['/gestionBuzon', 'altaParametrosProtocolo']);
    }

    /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionBancosComponent
  */
  async onPageChanged(event:any){
    this.page = event.page;
    /** Se crea el objeto con la paginacion */
    const claveIdentificacion = this.gestionParametrosForm.value.claveIdentificacion;
    const nombre = this.gestionParametrosForm.value.nombre;
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if(claveIdentificacion === '' && nombre === ''){
      await this.getConsultaParametos(this.protocolo.idProtocolo, this.fillObjectPag(this.page,this.rowsPorPagina));
    }else{
      this.gestionParametrosService.getListaParametro(this.protocolo.idProtocolo, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
        (result:any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
     }
  }

  /**
  * Metodo para poder realizar
  */
  regresarInicio() {
    localStorage.setItem('flagBorrarContenido', 'false');

    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/gestionBuzon/gestionProtocolos']);
  }

  loadPage() {
    const page = this.gestionParametrosService.getCurrentPageParam();
    if (page !== 1) {
      this.page = page;
      this.gestionParametrosService.setCurrentPageParam(1);
    }
  }

  savePage() {
    this.gestionParametrosService.setCurrentPageParam(this.page);
  }

}
