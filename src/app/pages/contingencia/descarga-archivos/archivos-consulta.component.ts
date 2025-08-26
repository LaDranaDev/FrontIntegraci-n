import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Globals } from "src/app/bean/globals-bean.component";
import { IDownloadRarFileComponent } from "src/app/bean/idownload-rar-file.component";
import { IGenerateXmlFileComponent } from "src/app/bean/igenerate-xml-file.component";
import { ModalInfoBeanComponents } from "src/app/bean/modal-info-bean.component";
import { FuncionesComunesComponent } from "src/app/components/funciones-comunes.component";
import { ModalInfoComponent } from "src/app/components/modals/modal-info/modal-info.component";
import { ContingenciaService } from "src/app/services/contingencia/contingencia.service";
import { IDownloadArchivoRequest } from "../request/idownloadarchivo-request.component";
import { IGenerateXmlFileRequest } from "../request/igeneratexmlfile-request.component";
import { ISearchArchivoRequest } from "../request/isearcharchivo-request.component";
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: 'app-archivos-consulta',
    templateUrl: './archivos-consulta.component.html',
    styleUrls: ['./archivos-consulta.component.css'],
    providers: [ContingenciaService]
})
export class ArchivosConsultaComponent implements OnInit {
    /** variable de control para saber si se realizo el submit del alta */
    submittedSearchArchivos = false;
    /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
    fechaInicialChange = "";
    fechaFinalChange = "";
    /** Variable para determinar si el result tiene registros y la cantidad de registros*/
    banderaHasRowsXml: boolean = true;
    countRowsXml: number = 0;
    banderaHasRowsDow: boolean = true;
    countRowsDow: number = 0;
    /** bandera para deshabilitar los botones de solicitar y descarga */
    banderaDisSolicitar = true;
    banderaDisDescargar = true;

    /**
     * Variable que contendra el id del usuario
     */
    usuarioStorage = "";

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
    });;

    /**
    * Atributo que contiene el objeto que guarda la informacion de busqueda
    * @type {ISearchArchivo}
    * @memberof ArchivosConsultaComponent
    */
    busquedaArchivo: ISearchArchivoRequest = {
        nombreFile: '',
        tipoFile: '',
        fechaInicial: '',
        fechaFinal: '',
        codigoCliente: '',
        numContrato: '',
        idUsuario: ''
    };

    /**
    * Atributo que contiene el objeto que guarda la informacion para descargar el archivo
    * @type {IDownloadArchivoRequest}
    * @memmerod ArchivoConsultaComponent
    */
    descargaArchivo: IDownloadArchivoRequest = {
        idSoliArch: 0,
        nombreFile: ''
    };

    /**
    * @description Formulario para la busqueda de archivos
    * @type {FormGroup}
    * @memberOf ArchivosConsultaComponent
    */
    formSearchArchivo: UntypedFormGroup = new UntypedFormGroup({});

    /**
    * @description  Fecha max para Fecha Fin
    * @memberOf ArchivosConsultaComponent
    */
    maxDateFin = new Date();

    /**
    * Atributo que contiene la lista de archivos para generar xml
    * @type {IGenerateXmlFileComponent[]>}
    * @memberof ArchivosConsultaComponent
    */
    listGenerateXmlFiles: IGenerateXmlFileComponent[] = [];

    /**
    * Atributo que contiene la lista de archivo para descargar rar
    * @type {IDownloadRarFile[]}
    * @memberof ArchivosConsultaComponent
    */
    listDownloadRarFiles: IDownloadRarFileComponent[] = [];

    /**
    * Atributo para poder mandar la peticion de generar el xml
    * @type {IGenerateXmlFileRequest}
    * @memberof ArchivosConsultaComponent
    */
    generatXmlFile: IGenerateXmlFileRequest = {
        listaIds: [],
        idUsuario: ''
    };

    /**
    * @param {FormBuilder} formBuilder - Elemento para generar el formulario y
    * aplicar las validaciones correspondientes
    * @param {DatePipe} datePipe - Pipe de fechas
    *
    * @memberof ArchivosConsultaComponent
    */
    constructor(
        private formBuilder: UntypedFormBuilder,
        public datePipe: DatePipe,
        private fc: FuncionesComunesComponent,
        private descargaService: ContingenciaService,
        public dialog: MatDialog,
        private globals: Globals,
        private translate: TranslateService,
    ) {
        /** Se ejecuta el metodo para la session */
        this.getSessionInLocalStorage();
    }

    /**
     * @description Se ejecuta el metodo que se encargara de obtener la session
     * y asignar el objeto a su variable correspondiente
     *
     * @memberOf ArchivosConsultaComponent
     */
    private getSessionInLocalStorage(){
        this.usuarioStorage = localStorage.getItem('UserID') || '';
    }


    /**
   * @description Inicializa componente
   *
   * @memberOf ArchivosConsultaComponent
   */
    ngOnInit(): void {
        /**
         * Se inicializa el formulario que se llenara
         * para poder realizar las busquedas
        */
        this.formSearchArchivo = this.initializeForm();

        /** Funcion para el onchange de los inpust dates */
        this.createSubscriptionsToDatesInputs();
    }

    /**
     * @description Metodo para poder generar los eventos de subscribe
     * de los campos dates y poder parsear la fecha
     * despues de seleccionar una fecha
     */
    private createSubscriptionsToDatesInputs(){
        /** Funcion onchange para cuando cambia la fecha inicial */
        this.formSearchArchivo.controls['fechaInicio'].valueChanges.subscribe(
            valFechaInicio => {
                this.fechaInicialChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaInicio,'dd/MM/yyyy') || '');
            }
        );
        /** Funcion onchange para cuando cambia la fecha final */
        this.formSearchArchivo.controls['fechaFin'].valueChanges.subscribe(
            valFechaFinal => {
                this.fechaFinalChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaFinal,'dd/MM/yyyy') || '');
            }
        );
    }

    /**
     * @description Metodo para poder inicializar el formulario y regresar dicho
     * formulario
     */
    private initializeForm() {
       return this.formBuilder.group({
            nombreArchivo: [''],
            selectTipoArchivo: [''],
            fechaInicio: [
                this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
                Validators.required
            ],
            fechaFin: [
                this.datePipe.transform(Date.now(), 'dd/MM/yyyy'),
                Validators.required
            ],
            codigoCliente: [''],
            contrato: ['']
        }, {
            validator: [
                this.fc.compareStartDateBiggerThanEnd('fechaInicio', 'fechaFin'),
                this.fc.compareEndDateBiggerThanStart('fechaFin', 'fechaInicio'),
                this.fc.validateDatesAndNumClienteOrContratoField('fechaInicio', 'fechaFin', 'codigoCliente', 'contrato')]
        });
    }

    /**
    * Metodo para inicializar el objeto de la
    * busqueda de archivos
    */
    private initializeObjSearchFiles() {
        if (this.fechaInicialChange === "") {
            this.fechaInicialChange = this.fc.parseFormatDate(this.formSearchArchivo.controls['fechaInicio'].value);
        }

        if (this.fechaFinalChange === "") {
            this.fechaFinalChange = this.fc.parseFormatDate(this.formSearchArchivo.controls['fechaFin'].value);
        }

        this.busquedaArchivo.nombreFile = this.formSearchArchivo.controls['nombreArchivo'].value;
        this.busquedaArchivo.tipoFile = this.formSearchArchivo.controls['selectTipoArchivo'].value;
        this.busquedaArchivo.fechaInicial = this.fechaInicialChange;
        this.busquedaArchivo.fechaFinal = this.fechaFinalChange;
        this.busquedaArchivo.codigoCliente = this.formSearchArchivo.controls['codigoCliente'].value;
        this.busquedaArchivo.numContrato = this.formSearchArchivo.controls['contrato'].value;
        this.busquedaArchivo.idUsuario = this.usuarioStorage;
    }

    /**
    * Metodo getter para utilziacion y validacion de formulario
    * en la vista
    */
    get formControlSearchArchivo() {
        return this.formSearchArchivo.controls;
    }

    /**
    * Metodo que se ejecutara al dar click sobre el boton de consultar
    */
    async onConsultar() {
        this.submittedSearchArchivos = true;

        if (this.formSearchArchivo.invalid) {
            return;
        }

        //Se inicializa el objeto de busqueda archivo
        this.initializeObjSearchFiles();
        //Se realiza la peticion al servicio
        await this.getConsultaListArchivos();
    }

    /**
    * @descripcion Metodo para poder obtener el listado de archivos
    *
    */
    private async getConsultaListArchivos() {
        try {
            await this.descargaService.getListDownloadFiles(this.busquedaArchivo).then(
                async (result: any) => {
                    this.listGenerateXmlFiles = result['listResponseFirstGrid'];
                    this.listDownloadRarFiles = result['listResponseSecondGrid'];
                    //Se procesa la lista de archivos para generar xml file
                    if (this.listGenerateXmlFiles.length > 0) {
                        this.banderaHasRowsXml = true;
                        this.countRowsXml = this.listGenerateXmlFiles.length;
                        this.banderaDisSolicitar = false;
                    } else {
                        this.cleanAllVariablesAfterErrorXml(false);
                        this.banderaDisSolicitar = true;
                    }
                    //Se procesa la lista de archivos para descargar el rar
                    if (this.listDownloadRarFiles.length > 0) {
                        this.banderaHasRowsDow = true;
                        this.countRowsDow = this.listDownloadRarFiles.length;
                        this.banderaDisDescargar = false;
                    } else {
                        this.cleanAllVariablesAfterErrorDow(false);
                        this.banderaDisDescargar = true;
                    }
                    this.globals.loaderSubscripcion.emit(false);
                }
            )
        } catch (e) {
            this.cleanAllVariablesAfterErrorXml(true);
            this.cleanAllVariablesAfterErrorDow(true);
            this.banderaDisDescargar = true;
            this.banderaDisSolicitar = true;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
                `${(this.translate.instant('pantalla.archivo.consulta.msjERRGEN01Observacion'))}`,
                'error',
                this.translate.instant('pantalla.archivo.consulta.msjERRGEN01Codigo'),
                `${(this.translate.instant('pantalla.archivo.consulta.msjERRGEN01Sugerencia'))}`
                )
        }

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
    * @description evento que se ejecutara para solo permitir valores
    * numericos
    */
    eventOnKeyOnlyNumbers(event: any) {
        this.fc.validateKeyCode(event);
    }

    /**
    * Metodo para limpiar variables usadas cuando ocurre algun
    * error en las peticiones por parte de archivos para xml
    */
    private cleanAllVariablesAfterErrorXml(valorBandera: boolean) {
        this.banderaHasRowsXml = valorBandera;
        this.countRowsXml = 0;
        this.listGenerateXmlFiles = [];
    }

    /**
    * Metodo para limpiar las variables usadas cuando ocurre algun
    * error en la peticion por parte de descargar archivo rar
    */
    private cleanAllVariablesAfterErrorDow(valorBandera: boolean) {
        this.banderaHasRowsDow = valorBandera;
        this.countRowsDow = 0;
        this.listDownloadRarFiles = [];
    }

    /**
    * Metodo para poder limpiar el formulario
    */
    onCleanForm() {
        this.submittedSearchArchivos = false;
        this.formSearchArchivo = this.initializeForm();
        /** Funcion para el onchange de los inpust dates */
        this.createSubscriptionsToDatesInputs();
    }

    /**
    * Evento onclick para solicitar documentos
    */
    async onClickSolicitarFiles(nombreIdCheck: string) {
        let arrayIds = this.fc.getAllCheckboxSelectedInTable(nombreIdCheck);
        if (arrayIds.length == 0) {
            //toast de error seleccione algunos check
            this.open(
                this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
                `${(this.translate.instant('pantalla.archivo.consulta.onClickSolicitarFilesObservacion'))}`,
                'error',
                this.translate.instant('pantalla.archivo.consulta.msjERRGEN01Codigo'),
                ``
                )
            return;
        }

        this.cleanAllVariablesAfterErrorXml(true);
        this.cleanAllVariablesAfterErrorDow(true);
        //Se llena el objeto que se enviara en la peticion
        this.generatXmlFile.listaIds = arrayIds;
        this.generatXmlFile.idUsuario = this.usuarioStorage;
        await this.consultCreateXmlFile();
    }

    /**
    * @descripcion Metodo de llamada al servicio para poder crear el archivo xml
    */
    private async consultCreateXmlFile() {
        try {
            await this.descargaService.consultCreateFileXml(this.generatXmlFile).then(
                async (result: any) => {
                    if (result.error == "OK00000") {

                        this.open(
                            this.translate.instant('modal.msjERRGEN0001Titulo'),
                            result.message,
                            'confirm',
                            result.error,
                            ``
                            )
                    } else {
                        this.open(
                            this.translate.instant('modal.msjERRGEN0001Titulo'),
                            result.message,
                            'error',
                            result.error,
                            ``
                            )
                    }
                    this.cleanAllVariablesAfterErrorXml(true);
                    this.cleanAllVariablesAfterErrorDow(true);
                    this.banderaDisDescargar = true;
                    this.banderaDisSolicitar = true;
                    this.globals.loaderSubscripcion.emit(false);
                }
            )
        } catch (e) {
            this.cleanAllVariablesAfterErrorXml(true);
            this.cleanAllVariablesAfterErrorDow(true);
            this.banderaDisDescargar = true;
            this.banderaDisSolicitar = true;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                `${(this.translate.instant('modal.msjERRGEN0001Observacion'))}`,
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                `${(this.translate.instant('modal.msjERRGEN0001Sugerencia'))}`
                )
        }
    }

    /**
     * @description evento para poder levantar el modal para
     * mostrar los mensajes de sucess o error
     * @param titulo indica si se ejecutara para error o success
     * @param contenido mensaje que se mostrara en el modal
     */
    open(titulo: string, contenido: string, type:any, errorCode:string, sugerencia:string) {
        this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia),hasBackdrop: true
        }
        );
      }
    
    /**
    * Evento onclick que se activara al dar click sobre el archivo a descargar
    */
    async onClickDownloadFiles() {
        //Se obtiene el listado de archivos que se seleccionaron para descargar
        var listFileDownloadRar = this.fc.readTableFilesRar('tableRarFiles');

        if (listFileDownloadRar.length == 0) {
            //toast de error seleccione algunos check
            this.open(
              this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
              `${(this.translate.instant('pantalla.archivo.consulta.msjERRPG01Observacion'))}`,
              '',
              this.translate.instant('pantalla.archivo.consulta.msjERRPG01Codigo'),
              `${(this.translate.instant('pantalla.archivo.consulta.msjERRPG01Sugerencia'))}`
              )
            return;
        }

        this.cleanAllVariablesAfterErrorXml(true);
        this.cleanAllVariablesAfterErrorDow(true);
        //Se llama el metodo que realizara la peticion al servicio
        await this.consultarDownloadFile(listFileDownloadRar);
    }

    /**
    * Metodo para poder llamar al servicio de descarga del archivo
    */
    private async consultarDownloadFile(listDownloadFilesRar: IDownloadArchivoRequest[]) {
        try {
            await this.descargaService.getDownloadFile(listDownloadFilesRar).then(
                async (result: any) => {
                    if (result.hasOwnProperty('type')) {
                        this.open(
                            this.translate.instant('modal.msjERRGEN0001Titulo'),
                            result.message,
                            'error',
                            result.error,
                            ``
                            )
                    } else {
                        if (result['listaArchivosConverted'].length > 0) {
                            this.fc.convertBase64ToDownloadFile(result['listaArchivosConverted']);
                            this.open(
                                this.translate.instant('modal.msjAB0010Titulo'),
                                this.translate.instant("modal.msjAB0010Observacion"),
                                'error',
                                this.translate.instant('modal.msjAB0010Codigo'),
                                ``
                                )
                        } else {
                            this.open(
                                this.translate.instant('modal.msjAB0010Titulo'),
                                this.translate.instant("modal.msjAB0010Observacion"),
                                'error',
                                this.translate.instant('modal.msjAB0010Codigo'),
                                ``
                                )
                        }
                    }
                    this.cleanAllVariablesAfterErrorXml(true);
                    this.cleanAllVariablesAfterErrorDow(true);
                    this.banderaDisDescargar = true;
                    this.banderaDisSolicitar = true;
                    this.globals.loaderSubscripcion.emit(false);
                }
            )
        } catch (e) {
            this.cleanAllVariablesAfterErrorXml(true);
            this.cleanAllVariablesAfterErrorDow(true);
            this.banderaDisDescargar = true;
            this.banderaDisSolicitar = true;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                `${(this.translate.instant('modal.msjERRGEN0001Observacion'))}`,
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                `${(this.translate.instant('modal.msjERRGEN0001Sugerencia'))}`
                )
        }
    }
}
