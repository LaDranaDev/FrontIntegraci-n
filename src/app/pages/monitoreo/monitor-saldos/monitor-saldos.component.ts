import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ComunesService } from 'src/app/services/comunes.service';
import { MonitorSaldosService } from 'src/app/services/monitoreo/monitor-saldos.service';

import { Globals } from 'src/app/bean/globals-bean.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';

import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { initDayOfMonth } from 'ngx-bootstrap/chronos/units/day-of-month';

@Component({
  selector: 'app-monitor-saldos',
  templateUrl: './monitor-saldos.component.html',
  styleUrls: ['./monitor-saldos.component.css']
})
export class MonitorSaldosComponent implements OnInit, OnDestroy {

  saldo:any
   /** Variable para identificar si el listado contiene o no valores*/
   banderaHasRows:boolean = false;
   /** Variable para indicar en que pagina se encuentra */
   page: number = 0;
   /** Variable para indicar el total de elementos que regresa la peticion */
   totalElements: number = 0;
   /** Variable para indicar el total de elementos que se mostraran por pagina */
   rowsPorPagina: number = 10;
   /** Variables para mostrar las vinetas de ultimo y primero */
   showBoundaryLinksMS: boolean = true;
   showDirectionLinksMS: boolean = true;
   /** Variables para mostrar el boton o no de exportar*/
   banderaBtnExportar: boolean = true;
   abreTabla=false
   abreFiltros=true
   codigoSi =  false
  abrir:boolean = true;
   abrir1:boolean = false;
  /**
   *  @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf MonitorOperacionesComponent
  */
  monitorSaldosForm!: UntypedFormGroup;

  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicialChange = "";
  fechaFinalChange = "";
  tabla:any

  /**
  * Atributo que contiene la configuracion del calendario
  * @type {Partial<BsDatepickerConfig>}
  * @memberof ArchivosConsultaComponent
  */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    adaptivePosition: true
  });

  /**Variable para los productos */
  productos:any
  /** Variable para el producto seleccionado */
  productoSeleccionado: any = '';

   /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent 
  */
   objPageable:IPaginationRequest;
   submittedMonitor = false;
  usuarioActual: string | null = '';

  constructor(
    private globals: Globals,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private service: ComunesService,
    private monitor: MonitorSaldosService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.monitorSaldosForm = this.initializeForm(); 
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page:this.page,
      size:this.rowsPorPagina,
      ruta:''
    }
   }

  
   clickSuscliption: Subscription | undefined;

   ngOnInit(){
    //this.initForm();
    
     this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.initForm();   
      }
     });
   }

   async initForm(){
    this.limpiar();
    try{
     await this.monitor.catalogo().then(
       async (productos:any)=>{
       this.productos = productos;
       this.globals.loaderSubscripcion.emit(false);
    })
   }catch(e){
     this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
     this.globals.loaderSubscripcion.emit(false);
   }
   }
 
   ngOnDestroy() {
     this.clickSuscliption?.unsubscribe();
   }


  private initializeForm() {
    return this.  formBuilder.group({
      codigoCliente:[''],
      estatusContrato:{value: '', disabled: true},
      razonSocial: {value:'' , disabled: true},
      archivoProcesado: [''],
      producto:[''],
      fechaInicial: [ new Date(),Validators.required],
      fechaFinal: [ new Date(),Validators.required]
    },{
      validator: [
          this.fc.compareStartDateBiggerThanEnd('fechaInicial', 'fechaFinal'),
          this.fc.compareEndDateBiggerThanStart('fechaFinal', 'fechaInicial'),
          this.fc.validateDatesAndNumClienteOrContratoField('fechaInicial', 'fechaFinal', 'codigoCliente', 'codigoCliente')]
  })
  
  }

  /**
   * Metodo que obtiene el producto seleccionado
   */
  valueChange(event:any){
    this.productoSeleccionado = event.target.value;
  }

   /**
    * @description Metodo para poder crear la fecha maxima
    */
   getMinDate() {
    let fecha = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1) + 6);
    date.setFullYear(Number(partsDate[2]) - 1);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }
  
   /**
      * @description Metodo para poder crear la fecha maxima
      */
   getMaxDate() {
    let fecha = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1));
    date.setFullYear(Number(partsDate[2]));
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }
  

   /**
     * @description Metodo para poder generar los eventos de subscribe
     * de los campos dates y poder parsear la fecha
     * despues de seleccionar una fecha
     */
   private createSubscriptionsToDatesInputs(){
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.monitorSaldosForm.controls['fechaInicial'].valueChanges.subscribe(
        valFechaInicio => {
            this.fechaInicialChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaInicio,'dd/MM/yyyy') || '');
        }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.monitorSaldosForm.controls['fechaFinal'].valueChanges.subscribe(
        valFechaFinal => {
            this.fechaFinalChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaFinal,'dd/MM/yyyy') || '');
        }
    );
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
x:any
myFunction(start:any, end:any) {   
    // One hour in milliseconds
  const oneHour = 1 * 60 * 60 *1000;
  // Calculating the time difference between two dates
  const diffInTime = end.getTime() - start.getTime();
  // Calculating the no. of days between two dates
  const diffInDays = Math.round((diffInTime / oneHour)/24);
  if(diffInDays < 0) {
    return diffInDays * -1
  }
  return diffInDays; 
  
}

myFunction90Dias(end:any) {   
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  // One hour in milliseconds
  const oneHour = 1 * 60 * 60 *1000;
  // Calculating the time difference between two dates
  const diffInTime = end.getTime() - Date.now();
  // Calculating the no. of days between two dates
  const diffInDays = Math.round((diffInTime / oneHour)/24);
  if(diffInDays < 0) {
    if(diffInDays * -1 > 90){
      this.openModalError(
        this.translate.instant('RF'),
        this.translate.instant('RRF'),'error','TRA003',this.translate.instant('pantalla.monitor.validacion.fecha02.Observacion'));
    }
    return diffInDays* -1
  }
  
  if(diffInDays > 90){
    this.openModalError(
      this.translate.instant('RF'),
      this.translate.instant('RRF'),
      'error','TRA003',this.translate.instant('pantalla.monitor.validacion.fecha02.Observacion'));
  }
  return diffInDays;
}


get formControlMonitor() {
  return this.monitorSaldosForm.controls;
}

  consultar(){
    if(this.codigoSi === true){
      this.submittedMonitor = false;
      if(this.monitorSaldosForm.value.fechaInicial === "" || this.monitorSaldosForm.value.fechaFinal === ""){
          this.openModalError(this.translate.instant('pantalla.monitor.validacion.AlertTitulo'),this.translate.instant('pantalla.monitor.validacion.rangoFechas.Observacion'),'alert',this.translate.instant('pantalla.monitor.validacion.Codigo'),this.translate.instant('pantalla.monitor.validacion.Sigerencia'));
           return
      }else{
        if( this.monitorSaldosForm.value.codigoCliente != ''){
          const inicio = this.monitorSaldosForm.value.fechaInicial //this.datePipe.transform(this.monitorSaldosForm.value.fechaInicial, 'dd/MM/yyyy')
          const fin =  this.monitorSaldosForm.value.fechaFinal //this.datePipe.transform(this.monitorSaldosForm.value.fechaFinal, 'dd/MM/yyyy') 
          this.saldo = {
            "codigoCliente" : this.monitorSaldosForm.value.codigoCliente,
            "nombreArchivo": this.monitorSaldosForm.value.archivoProcesado,
            "fechaInicio": this.datePipe.transform(inicio, 'dd/MM/yyyy'), //  "fechaInicio": "23/08/2013",
            "fechaFin": this.datePipe.transform(fin, 'dd/MM/yyyy'),
            //"fechaInicio": "23/08/2013", 
            //"fechaFin":"04/09/2013", 
            "claveProducto": this.monitorSaldosForm.value.producto,
          }
          if(this.monitorSaldosForm.value.fechaInicial === this.datePipe.transform(Date.now(), 'dd/MM/yyyy') && this.monitorSaldosForm.value.fechaFinal === this.datePipe.transform(Date.now(), 'dd/MM/yyyy') ){
          this.x = 1
          }else{
            this.x = this.myFunction90Dias(new Date((inicio)))
          }
          //this.x = this.myFunction90Dias(new Date((fin)))
          if(this.x < 90){
            const dias = this.myFunction(new Date(inicio), new Date((fin)))
          if(dias >= 0 && dias <= 7){
            this.monitor.obtenerSaldos(this.saldo, this.fillObjectPag(0,this.rowsPorPagina)).then((saldo:any) =>{
              if(saldo.content.length > 0){
                this.resultRequest(saldo);
              this.globals.loaderSubscripcion.emit(false);
              this.abrir = false;
              this.abrir1= true;
              this.abreTabla = true
              this.abreFiltros= false
              }else{
                this.globals.loaderSubscripcion.emit(false);
                this.openModalError(this.translate.instant('pantalla.monitor.validacion.noInformacion.Observacion'),this.translate.instant('pantalla.monitor.validacion.noInformacion.Observacion'),'info','INF005',this.translate.instant('pantalla.monitor.validacion.Sigerencia'));
              }
            })  
    
          }else{
            this.openModalError(
              this.translate.instant('RF'),
              this.translate.instant('RRF'),'error','TRA011',this.translate.instant('pantalla.monitor.validacion.mayor7dias.Observacion'));
          
          }
          }
        }else{
          this.openModalError(this.translate.instant('pantalla.monitor.validacion.AlertTitulo'),this.translate.instant('pantalla.monitor.validacion.codigoVacio.Observacion'),'alert',this.translate.instant('pantalla.monitor.validacion.Codigo'),this.translate.instant('pantalla.monitor.validacion.Sigerencia'));
        }
      }
  
    }else{
      this.openModalError(
        this.translate.instant('admonContratos.msjCTERR14Titulo'),
        this.translate.instant('RCDC')
        ,'error','TRA002',this.translate.instant('pantalla.monitor.validacion.codigoVacio.Observacion'));
       
    }
  }

  resultRequest(result:any){
    this.tabla= result.content;
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
  
  async exportar(){
    const excel =	{
      "monitorSaldosRequest":this.saldo,
       "usuario" : this.usuarioActual
   }
   try{
    await this.monitor.exportar(excel).then(
      async (excel:any) => {
      if (excel.data) {
        /** Se manda la informacion para realizar la descarga del archivo */
        this.fc.convertBase64ToDownloadFileInExport(excel);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (excel.code === '404') {
          this.openModalError(this.translate.instant('pantalla.monitor.validacion.ErrorTitulo'),excel.message,'error');
          this.globals.loaderSubscripcion.emit(false);
        }else{
          this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    });
   }catch(e){
    this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
   }
  }

  

   /**
   * 
   * Abrir el modal de error 
   */
   openModalError(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true}
      );
  }



  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event:any){
    this.page = 0
    this.page = event.page-1;

    
    this.tabla = [];
    this.monitor.obtenerSaldos(this.saldo, this.fillObjectPag(this.page,this.rowsPorPagina)).then((saldo:any) =>{
      this.resultRequest(saldo);
      this.globals.loaderSubscripcion.emit(false);
      //this.banderaHasRows = true
       //this.globals.loaderSubscripcion.emit(false)
    })  
    }



  regresar(){
    this.saldo={}
    this.monitorSaldosForm.reset();
    this.monitorSaldosForm = this.initializeForm(); 
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    this.abrir = true;
    this.abrir1= false;
    
    this.abreTabla = false
    this.abreFiltros= true
  }

  limpiar(){
    this.saldo={}
    this.banderaHasRows= false
    this.monitorSaldosForm.reset();
    this.monitorSaldosForm = this.initializeForm(); 
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
  }
  
  refrescar(){
    this.consultar();
  }

  /**
   * 
   * @Description Metodo para puros numeros
   */
  numerico(event:KeyboardEvent){this.fc.numberOnly(event);}

  /**Funcion: realiza la consulta de la informacion del cliente */
  async consultaDatosCliente(){
    try{
      if(this.monitorSaldosForm.value.codigoCliente != ""){
        await this.service.consultaInformacionCliente(this.monitorSaldosForm.value.codigoCliente).then(
          async (resp: any) => {
          /*if(resp.errors.length > 0){
            alert("error al consultar información del cliente");
            this.globals.loaderSubscripcion.emit(false);
          }*/
          if(resp.codError == 'CONT0011'){
            this.openModalError(this.translate.instant('pantalla.monitor.Inf02.Titulo'),this.translate.instant('pantalla.monitor.validacion.noInformacion.Observacion'),'info',this.translate.instant('pantalla.monitor.validacion.noInformacion.CONT0011Codigo'));
            this.globals.loaderSubscripcion.emit(false);
          }

          /*if(resp.status == "OK00000"){*/
          if(resp){
            this.monitorSaldosForm.patchValue({
              estatusContrato: resp.descEstatus,
              razonSocial: resp.razonSocial,
              });
              this.codigoSi = true
            this.globals.loaderSubscripcion.emit(false);
            //this.valueChange.emit(this.datospersonales);
            //this.service.datosContratoObtenido(true);
            //this.service.datos(this.datospersonales);
          }else{
            this.limpiar();
            this.globals.loaderSubscripcion.emit(false);
          }
        });
    }else{
      this.openModalError(this.translate.instant('pantalla.monitor.validacion.ErrorTitulo'),this.translate.instant('pantalla.monitor.validacion.IngreseNumero.Observacion'),'error');
      this.limpiar();
    }
    }catch(e){
      this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  disableEvent(event:any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  eveValidate(event: KeyboardEvent) {
    this.fc.onlyAlphabeticEspe(event);
  }
  

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

}
