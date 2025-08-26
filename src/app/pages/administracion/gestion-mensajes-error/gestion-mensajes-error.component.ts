import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { GestionMensajeErrorService } from 'src/app/services/administracion/gestion-mensaje-error.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-gestion-mensajes-error',
  templateUrl: './gestion-mensajes-error.component.html',
  styleUrls: ['./gestion-mensajes-error.component.css']
})
export class GestionMensajesErrorComponent implements OnInit, OnDestroy {

  usuarioActual: string | null = '';
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para indicar en que pagina se encuentra */

  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;

  page: number = 0;

  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 20;

  tablaMensajeError:any[]=[]
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  gestionMensajesErrorForm!: UntypedFormGroup;

  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable:IPaginationRequest;
  clickSuscliption: Subscription | undefined;


  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionMensajeErrorService: GestionMensajeErrorService,
    private router: Router,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    this.gestionMensajesErrorForm = this.initializeForm();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page:this.page,
      size:this.rowsPorPagina,
      ruta:''
    }
  }

  async ngOnInit() {
    this.usuarioActual = localStorage.getItem('UserID');

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;

      if (codeMenu === 6) {
        this.eventClean();
        try {
          await this.gestionMensajeErrorService.getTablaMensajeError("", "", this.fillObjectPag(this.page, this.rowsPorPagina)).then(
            async (tabla: any) => {
              this.resultRequest(tabla);
              this.globals.loaderSubscripcion.emit(false);
            })
        } catch (e) {
          this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


  resultRequest(result:any){
    this.tablaMensajeError= result.content;
    this.totalElements = result.totalElements;
    if(this.totalElements > 0){
      this.banderaHasRows = true;
    }else{
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
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      codigoErrorBack: [''],
      mensaje: [''],
    })
  }

    /**
   * Metodo para poder realizar la exportacion de archivos
   */

    async exportar() {
      try{
        this.codigoError = this.gestionMensajesErrorForm.value.codigoErrorBack;
        this.mensaje = this.gestionMensajesErrorForm.value.mensaje;
        if(this.codigoError === null){
          this.codigoError = ""
        }
        if(this.mensaje === null){
          this.mensaje = ""
        }
        const exportar = {
          "codErrBack": this.codigoError,
          "this.mensaje":this.mensaje,
          "usuario" : this.usuarioActual
        }
        await this.gestionMensajeErrorService.xls(exportar).then(
          async (result: any) => {
            if (result.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
            } else {
              if (result.code === '404') {
                this.openModalError('Error', result.message);
                this.globals.loaderSubscripcion.emit(false);
              }else{
                this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
                this.globals.loaderSubscripcion.emit(false);
              }
            }
          });
      }catch(e){
        this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      }
    }

  eventClean(){
    this.gestionMensajesErrorForm.reset()
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
      data: new ModalInfoBeanComponents(titulo,
        contenido,
        type,
        code,
        sugerencia), hasBackdrop: true
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
    sugerencia?: string){
    this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo,
      contenido,
      type,
      code,
      sugerencia), hasBackdrop: true}
    );
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event:any){
    this.page = 0
    this.page = event.page-1;
    this.codigoError = this.gestionMensajesErrorForm.value.codigoErrorBack;
    this.mensaje = this.gestionMensajesErrorForm.value.mensaje;

    if(this.codigoError === null){
      this.codigoError = ""
    }
    if(this.mensaje === null){
      this.mensaje = ""
    }
    this.tablaMensajeError=[]
    try{
      await this.gestionMensajeErrorService.getTablaMensajeError(this.codigoError.toUpperCase(), this.mensaje.toUpperCase(), this.fillObjectPag(this.page,this.rowsPorPagina)).then(
        async(tabla:any) =>{
        this.resultRequest(tabla);
        this.globals.loaderSubscripcion.emit(false);
    })
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }

  }
  codigoError:any
  mensaje:any
  async consultarError(){
    this.codigoError = this.gestionMensajesErrorForm.value.codigoErrorBack;
    this.mensaje = this.gestionMensajesErrorForm.value.mensaje;

    if(this.codigoError === null){
      this.codigoError = ""
    }
    if(this.mensaje === null){
      this.mensaje = ""
    }
    this.page = 0
    this.tablaMensajeError=[]
    try{
      await this.gestionMensajeErrorService.getTablaMensajeError(this.codigoError.toUpperCase(), this.mensaje.toUpperCase(), this.fillObjectPag(this.page,this.rowsPorPagina)).then(
        async(tabla:any) =>{
          if (tabla.totalElements <= 0){
            this.open('Aviso',
            this.translate.instant('pantalla.administracion.informacion.busqueda.tipoMensaje.Observacion'),
            'info');
            this.resultRequest(tabla);
            this.globals.loaderSubscripcion.emit(false);
          }else {
        this.resultRequest(tabla);
        this.globals.loaderSubscripcion.emit(false);
          }
      })
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }

  }

  /*

  async onPageChanged(event:any){
    this.page = 0
    this.page = event.page-1;
    /** Se crea el objeto con la paginacion *
    const claveIdentificacion = this.gestionBancosForm.value.claveIdentificacion;
    const nombre = this.gestionBancosForm.value.nombre;
    const banco = {
      "claveIdentificacion": claveIdentificacion,
      "nombre":nombre
    }
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado *
    if(claveIdentificacion === '' && nombre === ''){
      await
    }else{
      this.gestionBancosService.getBusquedaBanco(banco, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
        (result:any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
     }
*/
  agregarMensajeError(){
    this.gestionMensajeErrorService.setSaveLocalStorage('mensajeError', null);
    this.router.navigate(['/moduloAdministracion', 'mensajeError']);
  }

  editarMensajeError(idMensaje: number) {
    /** Se registra el buzon a editar en el localstorage */
    this.gestionMensajeErrorService.setSaveLocalStorage('mensajeError', idMensaje);
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/moduloAdministracion', 'mensajeError']);
  }
  detalleMensaje(idMensaje: number,){
      /** Se registra el buzon a editar en el localstorage */
    this.gestionMensajeErrorService.setSaveLocalStorage('mensajeError', idMensaje);
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/moduloAdministracion', 'detalleMensajeError']);
  }

}
