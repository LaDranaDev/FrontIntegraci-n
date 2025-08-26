import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { Router } from '@angular/router';
import { CpService } from '../../../services/administracion/cp.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-codigos-postales',
  templateUrl: './gestion-codigos-postales.component.html',
  styleUrls: ['./gestion-codigos-postales.component.css'],

})
export class GestionCodigosPostalesComponent implements OnInit, OnDestroy{

  usuarioActual: string | null = '';
  check:any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksCP: boolean = true;
  showDirectionLinksCP  : boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  codigoPostalForm!: UntypedFormGroup;
   /**
   * Datos para llenar la tabla de paises
   */
  tablaCP:any[]=[];
  /** Objeto de paises para inicializar busqueda */
  codigoPostal = {
    cp:"",
    sucursal:""
  }
  tip:any

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
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private router: Router,
    public cp: CpService,
    private comunService: ComunesService,
    private translate: TranslateService
    ) {
    this.codigoPostalForm = this.initializeForm();
    //Se inicializa el objeto pageable
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
      codigoPostal: [''],
      sucursal: [''],
      calculo:[''],
    })
  }


  async ngOnInit() {
    this.usuarioActual = localStorage.getItem('UserID');
    const actualizado = this.cp.getSaveLocalStorage('cpActualizado');

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async(resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 10) {
        this.limpiarCP()
        if (actualizado === null) {
          try {
            await this.cp.consultaTodosCP(this.fillObjectPag(this.page, this.rowsPorPagina)).then(
              async (tabla: any) => {
                this.resultRequest(tabla);
                this.globals.loaderSubscripcion.emit(false);
              })
          } catch (e) {
            this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
            this.globals.loaderSubscripcion.emit(false);
          }
        } else {
          this.codigoPostalForm.patchValue({
            codigoPostal: actualizado.cp,
            sucursal: actualizado.sucursal,
          })
          await this.cp.consultaCp(this.codigoPostalForm.value.codigoPostal, this.codigoPostalForm.value.sucursal, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
            async (tabla: any) => {
              this.resultRequest(tabla);
              this.cp.setSaveLocalStorage('cpActualizado', null);
              this.globals.loaderSubscripcion.emit(false);
            })
        }      }
    });


  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


  resultRequest(result:any){
    this.tablaCP= result.content;
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

  limpiarCP(){
    //this.submittedSearchBuzon = false;
    /** Se reinicia el formulario de busqueda */
    this.codigoPostalForm = this.initializeForm();
  }
  async consultarCP(){
    this.page = 0;
    const cp = this.codigoPostalForm.value.codigoPostal
    const su = this.codigoPostalForm.value.sucursal
    try{
      if(cp === '' && su === ''){
        await this.cp.consultaTodosCP(this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          async (tabla:any) =>{
          this.resultRequest(tabla);
          this.globals.loaderSubscripcion.emit(false);
        })
      }else{
        await this.cp.consultaCp(cp, su, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          async (tabla:any) =>{
          this.resultRequest(tabla);
          this.globals.loaderSubscripcion.emit(false);
        })
      }
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }
  }

   /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
   async onPageChanged(event:any){
    this.page = event.page-1;
    const cp = this.codigoPostalForm.value.codigoPostal
    const su = this.codigoPostalForm.value.sucursal
    try{
      if(cp === '' && su === ''){
        await this.cp.consultaTodosCP(this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          async (tabla:any) =>{
          this.resultRequest(tabla);
          this.globals.loaderSubscripcion.emit(false);
        })
      }else{
        await this.cp.consultaCp(cp, su, this.fillObjectPag(this.page,this.rowsPorPagina)).then(
          async (tabla:any) =>{
          this.resultRequest(tabla);
          this.globals.loaderSubscripcion.emit(false);
        })
      }
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
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
   * Abrir el modal de exportar los datos
   */
  openModal(){
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.onClickExportarCP(result);
      }
    });
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onClickExportarCP(tipo:any) {
    if(tipo === 'xlsx'){
      tipo = 'xls'
    }
    /** Se crea el objeto con la paginacion */
    const cp = this.codigoPostalForm.value.codigoPostal
    const su = this.codigoPostalForm.value.sucursal

    try{
      await this.cp.exportarCp(tipo,cp,su, this.usuarioActual).then(
        async (result: any) => {
        if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
        }
        else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
          }else{
            this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      })
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }
 }

 cambio(camb:any, cp:any){
  this.check = camb.target.checked === true ? 'A' : 'I'
  this.cp.actCalculo(this.check, cp).then((result: any) => {
    if(result.error == 'ER00000'){
      this.openModalError('Error', result.message,'error');
      this.globals.loaderSubscripcion.emit(false);
    }else{
      this.consultarCP();
    }
  })
 }

  editarCP(cp:any){
     /** Se registra el buzon a editar en el localstorage */
     this.cp.setSaveLocalStorage('cp', cp);
     /** Se hace el redirect a la vista de alta */
     this.router.navigate(['/moduloAdministracion', 'altaCodigoPostal']);
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
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true}
      );
  }
  agregar(){
    this.cp.setSaveLocalStorage('cp', null);
    this.router.navigate(['/moduloAdministracion', 'altaCodigoPostal']);
  }


}
