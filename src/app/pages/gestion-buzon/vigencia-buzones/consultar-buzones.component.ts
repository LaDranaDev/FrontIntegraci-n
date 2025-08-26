import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ContingenciaService } from 'src/app/services/contingencia/contingencia.service';
import { IConsultaBuzon } from 'src/app/bean/iconsulta-vigencia-buzones.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-consultar-buzones',
    templateUrl: './consultar-buzones.component.html',
    styleUrls: ['./consultar-buzones.component.css']
})
export class ConsultarBuzonesComponent implements OnInit, OnDestroy {
  
    /** variable de control para saber si se realizoel submit del search */
    submittedBuzonSearch = false;
    /** Variables para mostrar las vinetas de ultimo y primero */
    showBoundaryLinks: boolean = true;
    showDirectionLinks: boolean = true;
    /** Variable para indicar en que pagina se encuentra */
    page: number = 0;
    /** Variable para indicar el total de elementos que regresa la peticion */
    totalElements: number = 0;
    /** Variable para indicar el total de elementos que se mostraran por pagina */
    rowsPorPagina: number = 20;
    /** Variable para guardar el id del buzon a eliminar o editar */
    idBuzonDelEdit:number = 0;
    /** componente modal */
    modal:BsModalRef = new BsModalRef;
    /** Variable para identificar si el listado contiene o no valores*/
    banderaHasRows:boolean = false;

    /**
    * @description objeto de buzon para la busqueda del buzon
    * @type {string}
    * @memberOf ConsultarBuzonesComponent
    */
    busquedaBuzon:string = '';

    /**
    * @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf ConsultarBuzonesComponent
    */
    formSearchBuzon:UntypedFormGroup;

    /**
    * Atributo que representa la lista de buzones
    * @type {IConsultaBuzon[]}
    * @memberof ConsultarBuzonesComponent
    */
    listBuzones:IConsultaBuzon[] = [];

    /**
     * @description Objeto para el evento de paginacion
     * y ademas contiene el buzon a buscar
     * @type {IPaginationRequest}
     * @memberof ConsultarBuzonesComponent 
     */
    objPageable:IPaginationRequest;

    /**
    * Constructor de la clase
    * @param formBuilder - Elemento para generar el formulario y
    * aplicar las validaciones correspondientes
    * @param toastService -Servicio de alertas
    * @param router - Servicio de direccionamiento
    * @param modalService - Servicio para levantar el modal
    * @param {BuzonesService} buzonesService
    */
    constructor(
        private router:Router,
        private formBuilder: UntypedFormBuilder,
        private globals: Globals,
        private modalService:BsModalService,
        private buzonesService:ContingenciaService,
        private fc:FuncionesComunesComponent,
        public dialog: MatDialog,
        private translate: TranslateService,
        private comunService: ComunesService,
    ) { 
        /** Se inicializa el formulario para validar el search */
        this.formSearchBuzon = this.formBuilder.group({
            nameSearch:['',Validators.required]
        });

        //Se inicializa el objeto pageable
        this.objPageable = {
            page:this.page,
            size:this.rowsPorPagina,
            ruta:this.busquedaBuzon
        }
    }

    clickSuscliption: Subscription | undefined;

    ngOnInit(){
      //this.initForm();

      this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp:any) => {
        const { codeMenu } = resp;
        if (codeMenu === 9) {
            this.initForm();    
        }
      });
    }

    initForm(){
       this.onClickClean()
    }
  
    ngOnDestroy() {
      this.clickSuscliption?.unsubscribe();
    }
  


    /** 
    * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
    * 
    * @param numPage valor para indicar el numero de la pagina
    * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
    * @param ruta valor para indicar la palabra a buscar
    */
    private fillObjectPag(numPage:number,totalItemsPage:number,ruta:string){
        this.objPageable.page = numPage,
        this.objPageable.size = totalItemsPage;
        this.objPageable.ruta = ruta;
        return this.objPageable;
    }

    /**
    * @description Metodo para poder procesar el result de la peticion de busquedas
    * 
    * @param result objeto o arreglo que contiene la informacion del result
    * de las peticiones de busqueda
    */
    private processResultRequest(result:any){
        this.listBuzones = result.content;
        this.totalElements = result.totalElements;
        if(this.totalElements > 0){
            this.banderaHasRows = true;
        }else{
            this.banderaHasRows = false;
        }
    }

    /**
    * @descripcion Metodo para poder obtener el listado inicial de buzones
    * 
    * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
    */
    private async getConsultaListBuzones(objPaginacion:IPaginationRequest){
        try{
            await this.buzonesService.getistBuzones(objPaginacion).then(
                async (result:any) => {
                    /** Se habilita el metodo para proceso el result */
                    this.processResultRequest(result);
                    this.globals.loaderSubscripcion.emit(false);
                }
            )
        }catch(e){
            this.listBuzones = [];
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
    * @description Metodo para poder realizar la busqueda por palabra incluyendo la paginacion
    * 
    * @param objPagWord objeto que contiene las propiedades de paginacion y busqueda
    */
    private async getConsultaListBuzonesWithWord(objPagWord:IPaginationRequest){
        try{
            await this.buzonesService.getListBuzonesWithWord(objPagWord).then(
                async (result:any) => {
                    this.processResultRequest(result);
                    this.globals.loaderSubscripcion.emit(false);
                }
            )
        }catch(e){
            this.listBuzones = [];
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
    * Metodo getter para utilziacion y validacion de formulario
    * en la vista
    */
    get formControlSearchBuzon() {
        return this.formSearchBuzon.controls;
    }

    /**
    * @description Evento de busqueda de buzones
    * @memberOf ConsultarBuzonesComponent
    */
    async searchBuzones(){
        this.submittedBuzonSearch = true;
    
        if(this.formSearchBuzon.invalid){
            return;
        }
        /** Se establece el page a 0 para iniciar con el paginado */
        this.page = 0;
        await this.getConsultaListBuzonesWithWord(this.fillObjectPag(this.page,this.rowsPorPagina,this.busquedaBuzon));

        this.submittedBuzonSearch = false;
    }

    /**
    * @description Evento del keyPress para validar que el campo solo reciba
    * valores alphanumericos
    */
    eventAlphaNumericOnly(event:KeyboardEvent){
        this.fc.alphaNumberOnly(event);
    }

    /**
     * @description evento para el evento de pegar en un input
     */
    onPaste(event: ClipboardEvent){
        let textPasted = event.clipboardData?.getData('text') || '';
        let flag = true;
        for(let i = 0;i < textPasted.length;i++){
            if(!this.fc.alphaNumberOnlyForPasteEvent(textPasted[i].charCodeAt(0))){
                i = textPasted.length;
                flag = false;
            }
        }
        return flag;
    }

    /**
    * @description Evento de click en el boton de alta
    * @memberOf ConsultarBuzonesComponent
    */
    onCllickAltaBuzon(){
        if(this.buzonesService.validatePropertyExisteInLocalStorage('buzon')){
            this.buzonesService.removeSaveLocalStorage('buzon');
        }
        this.router.navigate(['/gestionBuzon','altaVigenciaBuzones']);
    }

    /**
    * @description Evento de click en el boton de Limpiar
    * @memberOf ConsultarBuzonesComponent
    */
    async onClickClean(){
        this.submittedBuzonSearch = false;
        /**Se limpia el formulario de busqueda */
        this.formSearchBuzon.reset();
        /** Se establece el page en el 0 */
        this.page=0;
        /** Se crea el objeto con la paginacion por default */
        await this.getConsultaListBuzones(this.fillObjectPag(this.page,this.rowsPorPagina,this.busquedaBuzon));
    }

    /**
    * @description Evento de click al momento de usar la paginacion
    * @memberOf ConsultarBuzonesComponent
    */
    async onPageChanged(event:any){
        this.page = event.page-1;
        /** Validacion para determinar si se uso el search antes de usar el paginado */
        if(this.busquedaBuzon === '' || this.busquedaBuzon === null){
            /** Se manda a realizar la peticion de obtener la informacion la siguiente pagina */
            await this.getConsultaListBuzones(this.fillObjectPag(this.page,this.rowsPorPagina,this.busquedaBuzon));
        }else{
            await this.getConsultaListBuzonesWithWord(this.fillObjectPag(this.page,this.rowsPorPagina,this.busquedaBuzon));
        }
    }

    /**
    * @description Evento al dar click en eliminar para levantar el modal de confirmacion
    */
    showConfirmDeleteBuzon(template:TemplateRef<any>,idBuzon:number){
        this.idBuzonDelEdit = idBuzon;
        this.modalService.show(template);
    }

    /**
    * @description Evento al dar click en closeModal para cerrar el modal de confirmacion
    */
    closeModalConfirmacion(){
        this.idBuzonDelEdit = 0;
        this.modalService.hide();
    }

    /**
    * @description evento para poder eliminar el buzon 
    */
    async deleteBuzon(){
        try{
            await this.buzonesService.deleteBuzon(this.idBuzonDelEdit).then(
                async (result:any) => {
                    this.globals.loaderSubscripcion.emit(false);
                    this.open('',result.message, 'info');
                    this.onClickClean();
                }
            )
        }catch(e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('modal.msjERRGEN0001Titulo'),
              this.translate.instant('modal.msjERRGEN0001Observacion'),
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              this.translate.instant('modal.msjERRGEN0001Observacion')
            );
        }
    
        this.idBuzonDelEdit = 0;
        this.modalService.hide();
    }

    /**
    * @descripcion evento para poder redirigirse a la vista de alta
    * pero enviando el parametro de id del buzon
    * @param idBuzon variable que contendra el id del buzon a editar
    */
    editBuzon(objBuzon:IConsultaBuzon){
        //Se convierte a string el valor
        objBuzon.periodoVigencia = objBuzon.periodoVigencia.toString();
        /** Se registra el buzon a editar en el localstorage */
        this.buzonesService.setSaveLocalStorage('buzon',objBuzon);
        /** Se hace el redirect a la vista de alta */
        this.router.navigate(['/gestionBuzon','altaVigenciaBuzones']);
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

}