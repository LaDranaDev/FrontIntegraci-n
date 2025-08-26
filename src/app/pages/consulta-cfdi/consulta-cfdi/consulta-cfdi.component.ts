import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { CookieService } from 'ngx-cookie-service';
import { IConsultaCfdiComponent } from 'src/app/bean/IConsultaCfdi.component';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { MatDialog } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-consulta-cfdi',
  templateUrl: './consulta-cfdi.component.html'
})
export class ConsultaCfdiComponent implements OnInit, OnDestroy {


  /** variable de control para saber si se realizo el submit del alta */
  submittedSearchArchivos = false;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /***Atributo que oculto para almacenar la pagina correcta */
  paginaOculta=0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicialChange = "";
  fechaFinalChange = "";
  /** Variable para determinar si el result tiene registros y la cantidad de registros*/
  banderaHasRowsXml: boolean = true;
  countRowsXml: number = 0;
  banderaHasRowsDow: boolean = true;
  countRowsDow: number = 0;
  /**Atributo que indicara si la consulta tiena informacion o esta vacia*/
  consultaVacia = false;

  listcfdi: IConsultaCfdiComponent[] = [];
  lstPaginacion: any[]=[];
  paginador="";
  /**Identificador de la factura a descargar */
  uuidDescarga="";
  banderaDescarga= false;
  /**Se realiza instcia del objeto de datos del contrato*/
  datospersonales: DatosCuentaBeanComponent = {
    numContrato: "", bucCliente: "", descEstatus: "", nombreCompleto: "",
    personalidad: "", cuentaEje: "", idContrato: "", razonSocial: ""
  };

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

  formSearchArchivo: UntypedFormGroup = new UntypedFormGroup({});
  clickSuscliption: Subscription | undefined;

  constructor(@Inject(DOCUMENT) private document: HTMLDocument,private formBuilder: UntypedFormBuilder,
  private globals: Globals, private service: ComunesService, public datePipe: DatePipe, private fc: FuncionesComunesComponent,
  private cookie: CookieService, public dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit(): void {
    this.clickSuscliption = this.service.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;

      if (codeMenu === 1) {
        this.limpiar()

         }
    });


  }
  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


  /*
   * @description Metodo para poder generar los eventos de subscribe
   * de los campos dates y poder parsear la fecha
   * despues de seleccionar una fecha
   */
  private createSubscriptionsToDatesInputs() {
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.formSearchArchivo.controls['fechaInicio1'].valueChanges.subscribe(
      valFechaInicio => {
        this.fechaInicialChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaInicio, 'dd/MM/yyyy') || '');
      }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.formSearchArchivo.controls['fechaFin1'].valueChanges.subscribe(
      valFechaFinal => {
        this.fechaFinalChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaFinal, 'dd/MM/yyyy') || '');
      }
    );
  }

  /**
      * @description Evento del keyPress para validar que el campo solo reciba
      * valores alphanumericos
      */
  eventAlphaNumericOnly(event: KeyboardEvent) {
    this.fc.alphaNumberOnly(event);
  }

  /**
      * @description evento que se ejecutara para solo permitir valores
      * numericos
      */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
  }

  /**
 * Metodo getter para utilziacion y validacion de formulario
 * en la vista
 */
  get formControlSearchArchivo() {
    return this.formSearchArchivo.controls;
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
    date.setFullYear(Number(partsDate[2]) - 4);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }

  /**Funcion: realiza la consulta de la informacion del cliente */
  consultaDatosCliente() {
    if (this.datospersonales.bucCliente != "") {
      this.formSearchArchivo.controls['codigoCliente'].setValue(this.datospersonales.bucCliente);
      this.service.consultaInformacionCliente(this.datospersonales.bucCliente).then((resp: any) => {
        if (resp.codError == "OK00000") {
          this.datospersonales.bucCliente = resp.bucCliente;
          this.datospersonales.numContrato = resp.numContrato;
          this.datospersonales.razonSocial = resp.razonSocial;
          this.datospersonales.idContrato = resp.idContrato;
          this.formSearchArchivo.controls['contrato'].setValue(resp.numContrato);
          this.formSearchArchivo.controls['codigoCliente'].setValue(this.datospersonales.bucCliente);
        } else {
          this.limpiar();
          this.formSearchArchivo.controls['contrato'].setValue('');
          this.formSearchArchivo.controls['codigoCliente'].setValue('');
          this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
        }
      });
      this.globals.loaderSubscripcion.emit(false);
    } else {
      this.open(this.translate.instant('pantalla.visualizarlayout.Titulo'),this.translate.instant('pantalla.visualizarlayout.infoObservacion'),'info',this.translate.instant('pantalla.consultaCFDI.info.codigo'),this.translate.instant('pantalla.visualizarlayout.infoSugerencia'));
      this.limpiar();
    }
  }
  /**Funcion que realiza el limpiado de los objetos */
  limpiar() {
    this.submittedSearchArchivos = false;
    this.formSearchArchivo = this.initializeForm();
    this.createSubscriptionsToDatesInputs();
    this.lstPaginacion = [];
    this.paginaOculta=0;
    this.page=0;
    this.paginador='';
    this.listcfdi = [];
    this.uuidDescarga='';
    this.banderaDescarga=false;
    this.banderaHasRows= false;
    this.consultaVacia = false;
    this.datospersonales.bucCliente='';
    this.datospersonales.numContrato='';
    this.datospersonales.razonSocial='';
  }

  /**
* @description Metodo para poder inicializar el formulario y regresar dicho
* formulario
*/
  private initializeForm() {
    return this.formBuilder.group({
      nombreArchivo: [''],
      selectTipoArchivo: [''],
      fechaInicio1: [
        this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
        Validators.required
      ],
      fechaFin1: [
        this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
        Validators.required
      ],
      codigoCliente: [''],
      contrato: ['']
    }, {
      validator: [
        this.fc.compareStartDateBiggerThanEnd('fechaInicio1', 'fechaFin1'),
        this.fc.compareEndDateBiggerThanStart('fechaFin1', 'fechaInicio1'),
        this.fc.compareDateRangeBigger('fechaFin1', 'fechaInicio1'),
        this.fc.validateDatesAndNumClienteOrContratoField('fechaInicio1', 'fechaFin1', 'codigoCliente', 'contrato')]
    });
  }



  /**
* @description evento para poder levantar el modal para
* mostrar los mensajes de sucess o error
* @param titulo indica si se ejecutara para error o success
* @param contenido mensaje que se mostrara en el modal
*/
  open(titulo: String, contenido: String, type?:any, errorCode?:string, sugerencia?:string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    }
    );
  }

  onPageChanged(event:any){
    let pagina =event.page-1
    /***Se realiza validacion de pagina actual vs pagina a paginar */
    if(pagina < this.page){
        this.paginaOculta = pagina;
    }else{
      /***Se realiza el seteo de la pagina actual */
      this.paginaOculta= pagina
    }
    let indicador = this.lstPaginacion.filter(identificador => identificador[0] === this.paginaOculta);
    this.paginador= indicador[0][1];
    this.onConsultar('R');
  }

  /**
      * Metodo que se ejecutara al dar click sobre el boton de consultar
      */
  async onConsultar(tipoConsulta:string) {
    this.submittedSearchArchivos = true;
    /**Se realiza vadalicion del formulario*/
    if (this.formSearchArchivo.invalid) {
      return;
    }

    if( tipoConsulta === 'N'){
      this.lstPaginacion = [];
      this.paginaOculta=0;
      this.page=0;
      this.paginador='';
      this.listcfdi = [];
    }
    /*** Se realiza validacion de fechas vacias*/
      if(this.fechaFinalChange === '' || this.fechaFinalChange === undefined){
        this.fechaFinalChange = this.fc.parseFormatDate(this.formSearchArchivo.controls['fechaFin1'].value);
      }
      /*** Se realiza validacion de fechas vacias*/
      if(this.fechaInicialChange === '' || this.fechaInicialChange === undefined){
        this.fechaInicialChange = this.fc.parseFormatDate(this.formSearchArchivo.controls['fechaInicio1'].value);
      }

    /**Se realiza el llenado del objeto */
      let data={
        "fechaInicial":this.fechaInicialChange,
        "fechaFinal": this.fechaFinalChange,
        "numContrato": this.formSearchArchivo.controls['codigoCliente'].value,
        "uuidPaginador":this.paginador
      };
    try {
      await this.service.consultaComplementoFacturas(data).then(
        async (result: any) => {
          /**Se realiza el seteo del listado de facturas */
          this.listcfdi = [... result.result.lstFacturas];
          if(result.result.paginacion === 'true'){
            if(this.paginador === ''){
              /**Se valida que que el objeto paginador no exista en el listado de paginador */
            let ObjetoPaginador:any = this.lstPaginacion.filter(identificador => identificador[0] === this.paginaOculta);
             if(ObjetoPaginador.length === 0){
                /**Se recupera el valor del cursor */
                let  pagina = [this.paginaOculta,this.paginador];
                this.lstPaginacion.push(pagina)
             }
            }
            /**Se valida que que el objeto paginador no exista en el listado de paginador */
            let ObjetoPaginador:any = this.lstPaginacion.filter(identificador => identificador[0] === this.paginaOculta+1);
            /**Se valida que el objeto sea nulo o undefinido para agregarlo al listado */
            if(ObjetoPaginador.length === 0){
              this.paginador = result.result.valueCursor;
              let paginaCursor = [this.paginaOculta+1,this.paginador];
              /**Se realiza el llenado del objeto */
              this.lstPaginacion.push(paginaCursor)
            }

          /**Se realiza el seteo del onjeto al listado */
          this.totalElements = (10*this.lstPaginacion.length);
          if(this.totalElements > 0){
            this.banderaHasRows = true;
        }else{
            this.banderaHasRows = false;
        }
          }
          this.globals.loaderSubscripcion.emit(false);
          if(this.listcfdi.length > 0){
            this.consultaVacia = true;
          }else{
            this.consultaVacia = false;
          }
        }
      )
    } catch (e) {
      this.listcfdi = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.paginaOculta =0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }
  /**Funcion que realiza la seleccion de la factura */
  async seleccionarRegistro(event:any){
     this.uuidDescarga= event.uuid;
     this.banderaDescarga= true;
  }

  async descagarDcoumento(){
    /**Se realiza validacion del objeto  */
    if(this.uuidDescarga !== undefined && this.uuidDescarga !==''){
      try {
        await this.service.descargarDocumentosxml(this.uuidDescarga).then(
      async (result: any) => {
        /***Se invoca metodo para descargar documento */
        this.downloadFile(result.result.nombreArchivo,result.result.documentoXml);
        this.globals.loaderSubscripcion.emit(false);
      }
      )} catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
    }
  }

      /* Descarga archivo
    * @param fileName: string Nombre del archivo
    * @param data: Cadena Base64
    */
      downloadFile(fileName: string, data: string): void {
        const base64 = data;
        const blob = this.stringBase64toBlob(base64, 'application/xml', 0);
        FileSaver.saveAs(blob, fileName);
        }

        /**
       * Convierte una cadena base64 a un tipo de dato Blob segun el valor de b64Data y el tipo de contenido
       * @param b64Data Cadena base64
       * @param contentType el tipo de contenido (application/pdf - application/vnd.ms-excel)
       * @param sliceSize Porcion o tamanio de bytes que se procesan en cada iteracion
       * @return Blob
       */
         public stringBase64toBlob(b64Data:any, contentType:any, sliceSize:any) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            const byteCharacters = atob(b64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              const slice = byteCharacters.slice(offset, offset + sliceSize);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
          }

}
