import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { gestionConexionContratoRespuesta } from 'src/app/interface/gestionConexionContratoRespuesta.interfase';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionConexionContratoService } from '../../../services/gestion-buzon/gestion-conexion-contrato.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-conexion-contrato',
  templateUrl: './gestion-conexion-contrato.component.html',
  styleUrls: ['./gestion-conexion-contrato.component.css']
})
export class GestionConexionContratoComponent implements OnInit, OnDestroy {

  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  conexionContrato : number = 1
  tabla:any[]=[];
  banderaBtnExportar: boolean = false;
  banderaHasRows: boolean = false;

  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
  gestionConexionContratoForm!: UntypedFormGroup;

  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent 
  */
  objPageable:IPaginationRequest;

  gestionConexion = {
    numeroContrato:"",
    codigoCliente:""
  }
  submittedSearch: boolean = false;

  constructor( 
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private router:Router,
    public gestionConexionContratoService: GestionConexionContratoService,
    private fc:FuncionesComunesComponent,
    private globals: Globals,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private comunService: ComunesService,

    ) { 
    this.gestionConexionContratoForm = this.initializeForm();
    this.objPageable = {
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
      numeroContrato: ['',[Validators.maxLength(12), Validators.minLength(12)]],
      codigoCliente: ['',[Validators.maxLength(8), Validators.minLength(8)]],
    })
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.eventClean()
    this.getGestionConexionContrato(this.fillObjectPag(this.page,this.rowsPorPagina));
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


  get formControlGestionSearch() {
    return this.gestionConexionContratoForm.controls;
  }
  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   * 
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getGestionConexionContrato(objPaginacion:IPaginationRequest){
    try{
      await this.gestionConexionContratoService.gestionConexionContrato(this.gestionConexion, objPaginacion).then(
          async (result:any) => {
            this.resultRequest(result);
            this.globals.loaderSubscripcion.emit(false);
          }
      )
    }catch(e){
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page=0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Titulo"), 

      );
    }
  }

  resultRequest(result:any){
    this.tabla= result.content;
    this.totalElements = result.totalElements;
    if(this.totalElements > 0){
      this.banderaHasRows = true;
    }else{
      this.gestionConexionContratoForm = this.initializeForm();
      this.banderaHasRows = false;
    }
    if(result.totalElements === 0){
      this.banderaBtnExportar = false;
    }else{
      this.banderaBtnExportar = true;
    }
  }


  /** 
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   * 
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
  */
  private fillObjectPag(numPage:number,totalItemsPage:number){
    this.objPageable.page = numPage,
    this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

   /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
   async onPageChanged(event:any){
    this.page = 0
    this.page = event.page-1;
    /** Se crea el objeto con la paginacion */
    const numeroContrato = this.gestionConexionContratoForm.value.numeroContrato;
    const codigoCliente = this.gestionConexionContratoForm.value.codigoCliente;
    const gestionConexion = {
      "numeroContrato": numeroContrato,
      "codigoCliente":codigoCliente
    }
    try{
      this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if(numeroContrato === '' && codigoCliente === ''){
      await this.getGestionConexionContrato(this.fillObjectPag(this.page,this.rowsPorPagina));
      }else{
        this.gestionConexionContratoService.gestionConexionContrato(gestionConexion, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          (result:any) => {
            this.resultRequest(result);
            this.globals.loaderSubscripcion.emit(false);
          }
        )
      }
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Titulo"), 

      );
    }
    }

  /**
   * Metodo que se ejecutara al realizar clcik
   * sobre el boton de clean
   */
  eventClean() {
    /** Se reinicia el formulario de busqueda */
    this.gestionConexionContratoForm = this.initializeForm();
  }

   /**
   * Metodo que se ejecutara al momento de dar
   * click en el boton de consultar
   */
  public async eventoConsultar() {
    
    this.submittedSearch = true;
    if(this.gestionConexionContratoForm.value.numeroContrato.length >= 1 && this.gestionConexionContratoForm.value.numeroContrato.length <= 11){
      this.open(
        'Error', 
        this.translate.instant("12.digitos"),
        "error",
        '',
        ""
      );
      return;
    }
    if(this.gestionConexionContratoForm.value.codigoCliente.length >= 1 && this.gestionConexionContratoForm.value.codigoCliente.length <= 7){
      this.open(
        'Error', 
        this.translate.instant("8.digitos"), 
        "error",
        '',
        ""
      );
      return;
    }
    
    this.submittedSearch = false;
    try{
     /** Se crea el objeto con la paginacion */
     const numeroContrato = this.gestionConexionContratoForm.value.numeroContrato;
     const codigoCliente = this.gestionConexionContratoForm.value.codigoCliente;
     const gestionConexion = {
       "numeroContrato": numeroContrato,
       "codigoCliente":codigoCliente
     }
    this.page = 0
    await this.gestionConexionContratoService.gestionConexionContrato(gestionConexion, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          async (result:any) => {
            this.gestionConexionContratoForm = this.initializeForm();
            this.resultRequest(result);
            this.globals.loaderSubscripcion.emit(false);
          }
      )
    }catch(e){
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.gestionConexionContratoForm = this.initializeForm();
      this.page=0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
      );
     
    }
  }



  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(  titulo: String,  contenido: String,  type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',  code?: string,  sugerencia?: string) {
      this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }
  

  /**
   * Abrir el modal de exportar los datos
   */
  openModal(){
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.onClickExportarGC(result);
      }
    });
  }

   /**
   * Metodo para poder realizar la exportacion de archivos
   */

async onClickExportarGC(tipoExportacion: string) {
    if(tipoExportacion === 'xlsx'){
      tipoExportacion = 'xls'
    }
    let gestionConexion = {
      "numeroContrato": '',
      "codigoCliente":''
    }
    try{
      await this.gestionConexionContratoService.exportarGestionConexionContrato(tipoExportacion, gestionConexion).then(
        async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            if (result.code === '404') {
              this.open(
                this.translate.instant("modal.msjERRGEN0001Titulo"), 
                result.message, 
                "error",
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
        
              );
              this.globals.loaderSubscripcion.emit(false);
            }else{
              this.open(
                this.translate.instant("modal.msjERRGEN0001Titulo"), 
                this.translate.instant("modal.msjERRGEN0001Observacion"), 
                "error",
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
              );

              this.globals.loaderSubscripcion.emit(false);
            }
          }
        });
    }catch(err){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("modal.msjERRGEN0001Titulo"), 
        this.translate.instant("modal.msjERRGEN0001Observacion"), 
        "error",
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
      );
    }

  }
  

   /**
   * 
   * Abrir el modal de error 
   */

  /**
   * Metodo para poder realizar la edicion
   * del editarConexionContrato  y configuracion
   */
  gestionconexionContrato(objParam:any, tipo: string){
    /** Se registra el buzon a editar en el localstorage */
    this.gestionConexionContratoService.setSaveLocalStorage('ConexionContrato',objParam);
    if(tipo == 'modificar'){
       /** Se hace el redirect a la vista de alta */
      this.router.navigate(['/gestionBuzon','modificarConexionContrato']); 
    }else{
      if(tipo == 'configurar'){
      this.router.navigate(['/gestionBuzon','configurarConexionContrato']); 
      }
    }
  }

  /**
   * 
   * @Description Metodo para puros numeros
   */
  numerico(event:KeyboardEvent){this.fc.numberOnly(event);}

  disableEvent(event:any) {
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
