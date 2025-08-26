import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { EdoCuentaService } from 'src/app/services/admin-contratos/edo-cuenta.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
    selector: 'app-edo-cuenta-intradia',
    templateUrl: './edo-cuenta-intradia.component.html',
    styleUrls: ['./edo-cuenta-intradia.component.css']
})
export class EdoCuentaIntradiaComponent implements OnInit {

    datos: any;
    usuarioActual: string | null = '';
    clickSuscliption: Subscription | undefined;
    /** Se inicializa el objeto que contendra los datos del contrato */
    datosContrato: DatosCuentaBeanComponent = {
        numContrato: '',
        bucCliente: '',
        descEstatus: '',
        nombreCompleto: '',
        personalidad: '',
        cuentaEje: '',
        idContrato: '',
        razonSocial: '',
    };

    cuentaIntradia: any = {
        consolidado: '',
        intradia: '',
        negativos: '',
        radio: '',
        tipoFormato: '',
        canalEntrega: '',
        clabeVitual: '',
        anulaciones: ',',
        xDivisa: '',
        folio: '',
        diaViejo: '',
        radioAnterior: '',
        tipoFormatoViejo: '',
        oldFrecuancia: '',
    };

    esconderDivisa: any
    /** contiene las horas seleccionadas */
    listHorasSelectedIzquierda: string[] = [];
    listCuentasSelectedIzquierda: string[] = [];
    cuentasIzquierdas: string[] = [];
    /** contiene las horas seleccionadas */
    listHorasSelectedDerecha: string[] = [];
    listCuentasSelectedDerecha: string[] = [];
    cuentasDerechas: string[] = [];
    /** Lista que contiene las horas */
    listHorasFirstSelect: any = [];
    listCuentasFirstSelect: any = [];
    listHorasFirstSelectRespaldo: any = [];
    listCuentasFirstSelectRespaldo: any = [];
    listHorasSecondSelect: any = [];
    listHorasSecondSelectRespaldo: any = [];
    listCuentasSecondSelect: any = [];
    listCuentasSecondSelectRespaldo: any = [];
    request: any;
    tiposFormatos: any
    canales: any;
    consolidadoPordia: any;
    radio1: any;
    radio2: any;
    disableTextbox = false;
    idFormatoMT940: any
    idFormatoMT940D: any
    idCanalSwiftFin: any
    idFormatoMovPeriodo: any
    idFormatoMT942: any
    hayDiferentesdivisas: any
    disablecheckDemanda = false
    disablecheckIntradia = false

    seasons2 = [
        {
            name: "ConsolidadoCuentas",
            value: this.translate.instant('RACC'),
        },
        {
            name: "cuenta",
            value: this.translate.instant('RAC'),
        }
    ];
    horaEjecucion: any = '';
    respaldo: any;

    constructor(
        public dialog: MatDialog,
        private service: ComunesService,
        private globals: Globals,
        private edoCuentaservice: EdoCuentaService,
        private fc: FuncionesComunesComponent,
        private translate: TranslateService
    ) {
        this.usuarioActual = localStorage.getItem('UserID');
    }

    ngOnInit(): void {
        this.cuentaIntradia.intradia = false;
        this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 11) {
                this.limpiar2()
                this.initForm(0, '');
            }
        });
    }
    async initForm(valo?: any, idTabla2?: any) {
        this.datos = this.service.datosContrato;
        this.datosContrato = this.datos;
        if (this.datos !== undefined) {
            this.datosContrato.bucCliente = this.datos.bucCliente;
            await this.getDatos(this.datos.numContrato, valo, idTabla2);
            this.pageIndex = 1
            this.pageIndex1 = 1
        }
        /*if(this.datosContrato.idEstatus == 43){
          this.parametrosContratoForm.disable();
        }
        */
    }


    async paginacion(pageConsultar: any, pageActual?: any) {
        var es = {
            "cuentaMov": "",
            "tipMovCta": "",
            "idContrato": this.datosContrato.idContrato,
            "numContrato": this.datosContrato.numContrato,
            "idTabla": this.idTabla,
            "inicioPantallaConfEdoCta": this.inicioPantallaConfEdoCta,
            "pagina1": pageConsultar, // a consultar
            "pagina2": pageActual // actual
        }
        try {
            await this.edoCuentaservice.paginacionIntradia(es).then((result: any) => {
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.idTabla = result.listaGetConfEstadosCuenta.idTablaTmp
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2, result.listaHoras, result.listaGetConfEstadosCuenta.intradiaHoras);
                this.globals.loaderSubscripcion.emit(false);
            })
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
        }
    }
    inicioPantallaConfEdoCta: any
    idTabla: any
    async getDatos(numContrato: any, valo?: any, idTabla1?: any) {
        try {
            await this.edoCuentaservice.getIntradia(numContrato, idTabla1).then((result: any) => {
                if (result.message) {
                    this.verMensajeErrorSoliEdoCta(result.message)
                    this.globals.loaderSubscripcion.emit(false);
                    return
                } else {
                    if (idTabla1 !== '') {
                        this.inicioPantallaConfEdoCta = 1
                    } else {
                        this.inicioPantallaConfEdoCta = 0
                    }
                    this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                    this.idTabla = result.listaGetConfEstadosCuenta.idTablaTmp
                    this.patchValue(result);
                    this.inhabiitar(result)
                    this.validaSepararDivisasSolEdoCta();
                    //this.paginacion(result);
                    this.globals.loaderSubscripcion.emit(false);
                    if (valo === 1) {
                        if (this.horaEjecucion === '' || this.horaEjecucion === null) {
                            this.open(
                                this.translate.instant('admonContratos.msjCONT0000Titulo'),
                                this.translate.instant('LIGE'),
                                'info',
                                'INF00008',
                                ''
                            );
                        } else {
                            var hora = this.translate.instant('1') + ' ' + this.horaEjecucion
                            this.open(
                                this.translate.instant('admonContratos.msjCONT0000Titulo'),
                                this.translate.instant('LIGE'),
                                'info',
                                'INF00008',
                                hora
                            );

                        }
                    }
                }
            })
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                '',
                this.translate.instant('Error.EDO'),
                'error'
            );
        }
    }

    validaSepararDivisasSolEdoCta() {
        const hayDiferentesdivisas = this.hayDiferentesdivisas
        let check = this.radio1
        if (check) {
            if (hayDiferentesdivisas !== '' && parseInt(hayDiferentesdivisas) > 1) {
                if (this.cuentaIntradia.tipoFormato === this.idFormatoMT940) {
                    this.esconderDivisa = false
                } else if (this.cuentaIntradia.tipoFormato === this.idFormatoMT940D) {
                    this.esconderDivisa = false
                } else if (this.cuentaIntradia.tipoFormato === this.idFormatoMT942) {
                    this.esconderDivisa = false
                } else {
                    this.esconderDivisa = true
                }
            } else {
                this.esconderDivisa = false
            }
        } else {
            this.esconderDivisa = false
        }
    }

    inhabiitar(data: any) {
        /* if (data.listaGetConfEstadosCuenta.banderaProductoEdoCta === 'N') {
            this.inhabilitarCuandoCancelado('CANCEL');
        } */
        if (data.listaGetConfEstadosCuenta.banderaProductoEdoCuenta === 'N' || data.listaGetConfEstadosCuenta.banderaProdEdoCtaActivo === 'N') {
            this.inhabilitarCuandoCancelado('CANCEL');
            if (data.listaGetConfEstadosCuenta.banderaProductoEdoCuenta === 'N') {
                this.open(this.translate.instant('configuracionEstadosCuenta.msjINF00013Titulo'), this.translate.instant('configuracionEstadosCuenta.msjINF00013Observacion'), 'alert',
                    this.translate.instant('configuracionEstadosCuenta.msjINF00013Codigo'), this.translate.instant('configuracionEstadosCuenta.msjINF00013Sugerencia'))
            } else {
                this.verMensajeErrorSoliEdoCta('INF00014');
            }
        }
    }

    inhabilitarCuandoCancelado(dato: any) {
        if (dato == 'CANCEL') {
            this.toggleDisable()
        }
    }
    toggleDisable() {
        this.disableTextbox = !this.disableTextbox;
    }


    verMensajeErrorSoliEdoCta(code: any) {
        if (code === 'INF000013') {
            this.open(
                this.translate.instant('NEP'),
                this.translate.instant('PAPPEC'),
                'alert',
                'INF000013',
                this.translate.instant('sugerencia')
            );
            this.inhabilitarCuandoCancelado('CANCEL');
        }
        if (code === 'INF00003') {
            this.open(
                //this.translate.instant('')
                this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
                this.translate.instant('CCC'),
                'alert',
                'INFO00S3',
                this.translate.instant('CCNV')
            );
            this.inhabilitarCuandoCancelado('CANCEL');
        }
        if (code === 'CEC00C1') {
            this.open(
                this.translate.instant('NEPEC'),
                this.translate.instant('PAPP'),
                'alert',
                'INF000013',
                this.translate.instant('sugerencia')
            );
            this.inhabilitarCuandoCancelado('CANCEL');
        }
        if (code === 'CEC00I1') {
            this.open(
                this.translate.instant('admonContratos.msjCONT0000Titulo'),
                this.translate.instant('PECI'),
                'alert',
                'INF00008',
                this.translate.instant('LIGE')
            );
        }
        if (code === 'CEC00E1') {
            this.open(
                this.translate.instant('admonContratos.msjCONT0000Titulo'),
                this.translate.instant('ETIRE'),
                'alert',
                'INF00009',
                this.translate.instant('resultado')
            );
        }
        if (code === 'ERROR_01') {
            this.open(

                this.translate.instant('EBD'),
                this.translate.instant('PCA'),
                'alert',
                code.code,
                this.translate.instant('OEICBD')
            );
        }
        if (code === 'INFO00S1') {
            if (code.msjValHorario) {
                this.open(
                    this.translate.instant('SESGEC'),//titulo
                    this.translate.instant('solicitudEstadosCuenta.msjINFO00S1Observacion'), //descrip
                    'alert',
                    'INFO00S1',//code
                    '' //sugrencia
                );
            }
        }
        if (code === 'ERR00S3') {
            this.open(
                this.translate.instant('solicitudEstadosCuenta.msjERR00S3Titulo'),//titulo
                this.translate.instant('solicitudEstadosCuenta.msjERR00S3Observacion'), //descrip
                'alert',
                'ERR00S3',//code
                '' //sugrencia
            );
        }
        if (code === 'ERR00S4') {
            this.open(
                this.translate.instant('SECFH'),//titulo
                this.translate.instant('solicitudEstadosCuenta.msjERR00S5Observacion'), //descrip
                'alert',
                'ERR00S4',//code
                '' //sugrencia
            );
        }
        if (code === 'ERR00S5') {
            this.open(
                this.translate.instant('SECFH'),//titulo
                '', //descrip
                'info',
                'ERR00S4',//code
                this.translate.instant('solicitudEstadosCuenta.msjERR00S5Observacion') //sugrencia
            );
        }
        if (code === 'ERR00S6') {
            this.open(
                this.translate.instant('solicitudEstadosCuenta.msjERR00S7Titulo'),//titulo
                this.translate.instant('solicitudEstadosCuenta.msjERR00S5Observacion'), //descrip
                'info',
                'ERR00S6',//code
                this.translate.instant('EPSFG') //sugrencia
            );
        }
        if (code === 'CONT0011') {
            this.open(
                this.translate.instant('solicitudEstadosCuenta.msjERR00S7Titulo'),//titulo
                this.translate.instant('planCalidad.cambioEst.msjINF011xSugerencia'), //descrip
                'info',
                'CONT0011',//code
                this.translate.instant('contingencia.msjERR007Titulo') //sugrencia
            );
        }
        if (code === 'ERR00S7') {
            this.open(
                this.translate.instant('solicitudEstadosCuenta.msjERR00S7Titulo'),//titulo
                this.translate.instant('FDSEC'), //descrip
                'info',
                'ERR00S7',//code
                this.translate.instant('solicitudEstadosCuenta.msjERR00S7Sugerencia') //sugrencia
            );
        }
        if (code === 'INF00014') {
            this.open(
                this.translate.instant('configuracionEstadosCuenta.msjINF00014Titulo'),//titulo
                '', //descrip
                'info',
                'INF00014',//code
                this.translate.instant('configuracionEstadosCuenta.msjINF00014Observacion') //sugrencia
            );
        }

    }
    patchValue(datos: any) {


        this.cuentaIntradia.negativos = datos.signosNegativosMostrar === 'A' ? true : false;
        this.tiposFormatos = datos.listaFormatosArchivo;
        this.cuentaIntradia.radio = datos.listaGetConfEstadosCuenta.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo;
        this.respaldo = this.cuentaIntradia.radio
        this.canales = datos.canalesCntr;
        this.cuentaIntradia.consolidado = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[0].idCatalogo)
        this.cuentaIntradia.intradia = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[1].idCatalogo)
        if (this.cuentaIntradia.radio === null) {
            this.radio1 = false
            this.radio2 = false
            this.cuentaIntradia.xDivisa = false
        } else {
            this.radio1 = (this.cuentaIntradia.radio.includes(datos.tipoRecepcion[0]) || this.cuentaIntradia.radio.includes('D'))
            this.radio2 = this.cuentaIntradia.radio.includes(datos.tipoRecepcion[1])
            this.cuentaIntradia.xDivisa = this.cuentaIntradia.radio.includes('D')
        }
        this.cuentaIntradia.tipoFormato = datos.listaGetConfEstadosCuenta.tipoFormato.idCatalogo
        this.cuentaIntradia.tipoFormatoViejo = this.cuentaIntradia.tipoFormato
        this.cuentaIntradia.canalEntrega = datos.listaGetConfEstadosCuenta.idCanalEntrega
        this.cuentaIntradia.anulaciones = datos.anulaInd.indicador === 'A' ? true : false
        this.cuentaIntradia.clabeVitual = datos.cuentaClabeMostrar === 'A' ? true : false
        this.cuentaIntradia.folio = datos.folioEnc
        this.cuentaIntradia.oldFrecuancia = datos.listaGetConfEstadosCuenta.frecuenciasId

        this.assingListadoHoraSelect(datos.respuesta1, datos.respuesta2, datos.listaHoras, datos.listaGetConfEstadosCuenta.intradiaHoras);

        if (this.cuentaIntradia.selectDia === undefined) {
            this.cuentaIntradia.selectDia = 0
        }
        this.idFormatoMT940 = datos.idFormatoMT940
        this.idFormatoMT940D = datos.idFormatoMT940D
        this.idCanalSwiftFin = datos.idCanalSwiftFin
        this.idFormatoMovPeriodo = datos.idFormatoMovPeriodo
        this.idFormatoMT942 = datos.idFormatoMT942
        this.hayDiferentesdivisas = datos.hayDiferentesdivisas

        if (this.cuentaIntradia.radio === undefined || this.cuentaIntradia.radio === '' || this.cuentaIntradia.radio === null || this.cuentaIntradia.radio === 'D') {
            this.cuentaIntradia.radio = 'C'
        }
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    cambioTipoFormato(event: any) {
        if (event === this.idFormatoMovPeriodo) {
            this.inhabilitarPorFormatoMovPeriodo();
            this.validaSepararDivisasSolEdoCta()
        } else if (event === this.idFormatoMT940) {
            this.inhabilitarPorFormatoMT940()
        } else if (event === this.idFormatoMT940D) {
            this.inhabilitarPorFormatoMT940D()
        } else if (event === this.idFormatoMT942) {
            this.inhabilitarPorFormatoMT942()
        } else {
            this.habilitarPorFormato();
            this.validaSepararDivisasSolEdoCta()
        }
    }

    habilitarPorFormato() {
        this.disablecheckDemanda = false
        this.disablecheckIntradia = false
    }

    inhabilitarPorFormatoMovPeriodo() {
        this.disablecheckDemanda = true
        this.cuentaIntradia.consolidado = false
        this.inhabilitarIntradia()
        this.esconderDivisa = false
    }

    inhabilitarIntradia() {
        this.disablecheckDemanda = false
        this.cuentaIntradia.intradia = false
        this.disablecheckIntradia = true
        this.validateAndRemoveHoraToRigthSideSelectedTodos();
    }

    inhabilitarPorFormatoMT940() {
        this.disablecheckDemanda = true
        this.cuentaIntradia.consolidado = false
        this.esconderDivisa = false
        this.inhabilitarIntradia()
    }
    inhabilitarPorFormatoMT940D() {
        this.disablecheckDemanda = true
        this.cuentaIntradia.consolidado = false
        this.esconderDivisa = false
    }
    inhabilitarPorFormatoMT942() {
        this.disablecheckDemanda = false
        this.disablecheckIntradia = false
        this.cuentaIntradia.consolidado = false
        this.esconderDivisa = false
    }

    cambio(dato: any) {
        if (dato.value === 'P') {
            this.esconderDivisa = false
        } else {
            this.cuentaIntradia.xDivisa = this.respaldo.includes('D')
            this.validaSepararDivisasSolEdoCta()
        }

    }
    /**
    * Evento que se lanzara al dar click sobre el boton
    * para passar la hora del lado izquierdo al lado
    * derecho
    *
    * agregar nueva hora
    */
    addNewHour() {
        if (!this.listHorasSelectedIzquierda.length) {
            this.open(
                this.translate.instant('modals.edoCuentaConsolidado.error.title'),
                this.translate.instant('modals.edoCuentaConsolidado.error.bodyIzq'),
                'alert',
                this.translate.instant('modals.edoCuentaConsolidado.error.codeIzq'),
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia'),
            );

        } else {
            if (this.listHorasSelectedIzquierda.indexOf('-1') >= 0) {
                //Se selecciono la opcion de todos
                this.validateAndAddHoraToRigthSideSelectedTodos();
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                this.validateAndAddHoraToRigthWithOutSelectedTodos();
            }
        }
    }

    async addNewCuenta(): Promise<void> {
        if (!this.listCuentasSelectedIzquierda.length) {
            this.open(
                this.translate.instant('modals.edoCuentaConsolidado.error.title'),
                this.translate.instant('modals.edoCuentaConsolidado.error.bodyIzq'),
                'alert',
                this.translate.instant('modals.edoCuentaConsolidado.error.codeIzq'),
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia'),
            );
        } else {
            if (this.listCuentasSelectedIzquierda.indexOf('-1') >= 0) {
                //Se selecciono la opcion de todos
                this.validateAndAddCuentaToRigthSideSelectedTodos();
                var idContratosCuantasEnviar: any = []
                this.listCuentasSecondSelect.forEach(function (value: any) {
                    idContratosCuantasEnviar.push(value)
                });
                this.cuentasAgregar('SA', idContratosCuantasEnviar)
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                this.validateAndAddCuentaToRigthWithOutSelectedTodos();
                await this.cuentasAgregar('SA', this.listCuentasSelectedIzquierda);

            }
        }
    }
    /**
     * Evento que se lanzara al dar click sobre el boton
     * para pasar la hora del lado derecho al lado
     * izquierdo
     *
     * eliminar una hora
     */
    removeHour() {
        if (!this.listHorasSelectedDerecha.length) {
            this.open(
                this.translate.instant('modals.edoCuentaConsolidado.error.title'),
                this.translate.instant('modals.edoCuentaConsolidado.error.bodyDer'),
                'alert',
                this.translate.instant('modals.edoCuentaConsolidado.error.codeDer'),
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia'),
            );
        } else {
            if (this.listHorasSelectedDerecha.indexOf('-1') >= 0) {
                //Se selecciono la opcion de todos
                this.validateAndRemoveHoraToRigthSideSelectedTodos();
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                this.validateAndRemoveHoraToRigthWithOutSelectedTodos();
            }
        }
    }

    async removeCuenta() {
        if (!this.listCuentasSelectedDerecha.length) {
            this.open(
                this.translate.instant('modals.edoCuentaConsolidado.error.title'),
                this.translate.instant('modals.edoCuentaConsolidado.error.bodyDer'),
                'alert',
                this.translate.instant('modals.edoCuentaConsolidado.error.codeDer'),
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia'),
            );
        } else {
            if (this.listCuentasSelectedDerecha.indexOf('-1') >= 0) {
                //Se selecciono la opcion de todos
                this.validateAndRemoveCuentaToRigthSideSelectedTodos();
                var idContratosCuantasEnviar: any = []
                this.listCuentasFirstSelect.forEach(function (value: any) {
                    idContratosCuantasEnviar.push(value)
                });
                this.cuentasRegresar('NA', idContratosCuantasEnviar);
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                try {
                    this.validateAndRemoveCuentaToRigthSideSelectedTodos();
                    this.cuentasRegresar('NA', this.listCuentasSelectedDerecha);
                } catch (error) {
                    console.log('error', error);
                }


            }
        }
    }


    /**
    * Metodo para validar si la hora del lado izquierdo
    * ya existe o no en la lista de horas del lado derecho
    * cuando se selecciona la opcion de todos
    */
    validateAndAddHoraToRigthSideSelectedTodos() {
        //Se selecciono la opcion todos
        var listadoHorasAdd: any = [];
        var listHorasRemoveUntilExist: any = [];
        for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
            var objLeftHora = this.listHorasFirstSelect[i];
            listHorasRemoveUntilExist.push(objLeftHora);
            var banderaExist = false;
            for (var j = 0; j < this.listHorasSecondSelect.length; j++) {
                var objRightHora = this.listHorasSecondSelect[j];
                if (
                    objLeftHora['descripcionCatalogo'] ==
                    objRightHora['descripcionCatalogo']
                ) {
                    banderaExist = true;
                    j = this.listHorasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoHorasAdd.push(objLeftHora);
            }
        }
        this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
            this.listHorasSecondSelect,
            listadoHorasAdd
        );
        //[...this.listHorasSecondSelect,...listadoHorasAdd];
        //Se eliminan los elementos seleccionados
        listHorasRemoveUntilExist.forEach((option: any) => {
            this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
                (ele: any) => {
                    return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
                }
            );
        });
    }

    validateAndAddCuentaToRigthSideSelectedTodos() {
        //Se selecciono la opcion todos
        var listadoCuentaAdd: any = [];
        var listCuentaRemoveUntilExist: any = [];
        for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
            var objLeftHora = this.listCuentasFirstSelect[i];
            listCuentaRemoveUntilExist.push(objLeftHora);
            var banderaExist = false;
            for (var j = 0; j < this.listCuentasSecondSelect.length; j++) {
                var objRightHora = this.listCuentasSecondSelect[j];
                if (
                    objLeftHora['numCuenta'] ==
                    objRightHora['numCuenta']
                ) {
                    banderaExist = true;
                    j = this.listCuentasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoCuentaAdd.push(objLeftHora);
            }
        }
        this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
            this.listCuentasSecondSelect,
            listadoCuentaAdd
        );
        //[...this.listHorasSecondSelect,...listadoHorasAdd];
        //Se eliminan los elementos seleccionados
        listCuentaRemoveUntilExist.forEach((option: any) => {
            this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
                (ele: any) => {
                    return ele['numCuenta'] != option['numCuenta'];
                }
            );
        });
    }

    /**
     * Metodo para validar si la hora del lado derecho
     * ya existe o no en la lista de horas del lado izquierdo
     * cuando se selecciona la opcion de todos
     */
    validateAndRemoveHoraToRigthSideSelectedTodos() {
        //Se selecciono la opcion todos
        var listadoHorasRemove: any = [];
        var listHorasRemoveUntilExist: any = [];
        for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
            var objRigthtHora = this.listHorasSecondSelect[i];
            listHorasRemoveUntilExist.push(objRigthtHora);
            var banderaExist = false;
            for (var j = 0; j < this.listHorasFirstSelect.length; j++) {
                var objLeftHora = this.listHorasFirstSelect[j];
                if (
                    objRigthtHora['descripcionCatalogo'] ==
                    objLeftHora['descripcionCatalogo']
                ) {
                    banderaExist = true;
                    j = this.listHorasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoHorasRemove.push(objRigthtHora);
            }
        }
        this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
            this.listHorasFirstSelect,
            listadoHorasRemove
        );
        //[...this.listHorasFirstSelect,...listadoHorasRemove];
        //Se eliminan los elementos seleccionados
        listHorasRemoveUntilExist.forEach((option: any) => {
            this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
                (ele: any) => {
                    return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
                }
            );
        });
    }

    validateAndRemoveCuentaToRigthSideSelectedTodos() {
        //Se selecciono la opcion todos
        var listadoCuentasRemove: any = [];
        var listCuentasRemoveUntilExist: any = [];
        for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
            var objRigthtHora = this.listCuentasSecondSelect[i];
            listCuentasRemoveUntilExist.push(objRigthtHora);
            var banderaExist = false;
            for (var j = 0; j < this.listCuentasFirstSelect.length; j++) {
                var objLeftHora = this.listCuentasFirstSelect[j];
                if (
                    objRigthtHora['numCuenta'] ==
                    objLeftHora['numCuenta']
                ) {
                    banderaExist = true;
                    j = this.listCuentasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoCuentasRemove.push(objRigthtHora);
            }
        }
        this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
            this.listCuentasFirstSelect,
            listadoCuentasRemove
        );
        //[...this.listHorasFirstSelect,...listadoHorasRemove];
        //Se eliminan los elementos seleccionados
        listCuentasRemoveUntilExist.forEach((option: any) => {
            this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
                (ele: any) => {
                    return ele['numCuenta'] != option['numCuenta'];
                }
            );
        });
    }
    /**
     * Metodo para validar si la hora del lado izquierdo
     * ya existe o no en la lista de horas del lado derecho
     * cuando se selecciona 1 o mas horas que no sea la opcion
     * todos
     */
    validateAndAddHoraToRigthWithOutSelectedTodos() {
        var listadoHorasAdd: any = [];
        var listHorasRemoveUntilExist: any = [];
        this.listHorasSelectedIzquierda.forEach((horaId) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
                var objHora = this.listHorasFirstSelect[i];
                if (objHora['idCatalogo'] === horaId) {
                    objHoraSelected = objHora;
                    listHorasRemoveUntilExist.push(objHoraSelected);
                    i = this.listHorasFirstSelect.length;
                }
            }
            for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
                var objRightHora = this.listHorasSecondSelect[i];
                if (
                    objHoraSelected['descripcionCatalogo'] ==
                    objRightHora['descripcionCatalogo']
                ) {
                    banderaExist = true;
                    i = this.listHorasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoHorasAdd.push(objHoraSelected);
            }
        });
        this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
            this.listHorasSecondSelect,
            listadoHorasAdd
        );
        //[...this.listHorasSecondSelect,...listadoHorasAdd];
        //Se eliminan los elementos seleccionados
        listHorasRemoveUntilExist.forEach((option: any) => {
            this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
                (ele: any) => {
                    return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
                }
            );
        });
        this.listHorasSelectedIzquierda = [];
    }

    validateAndAddCuentaToRigthWithOutSelectedTodos() {
        var listadoCuentaAdd: any = [];
        var listCuentaRemoveUntilExist: any = [];
        this.listCuentasSelectedIzquierda.forEach((horaId: any) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
                var objHora = this.listCuentasFirstSelect[i];
                if (objHora['idContratoCuenta'] === horaId.idContratoCuenta) {
                    objHoraSelected = objHora;
                    listCuentaRemoveUntilExist.push(objHoraSelected);
                    i = this.listCuentasFirstSelect.length;
                }
            }
            for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
                var objRightHora = this.listCuentasSecondSelect[i];
                if (
                    objHoraSelected['numCuenta'] ==
                    objRightHora['numCuenta']
                ) {
                    banderaExist = true;
                    i = this.listCuentasSecondSelect.length;
                }
            }
            if (!banderaExist) {
                listadoCuentaAdd.push(objHoraSelected);
            }
        });
        this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
            this.listCuentasSecondSelect,
            listadoCuentaAdd
        );
        //[...this.listHorasSecondSelect,...listadoHorasAdd];
        //Se eliminan los elementos seleccionados
        listCuentaRemoveUntilExist.forEach((option: any) => {
            this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
                (ele: any) => {
                    return ele['numCuenta'] != option['numCuenta'];
                }
            );
        });
    }

    validateAndRemoveHoraToRigthWithOutSelectedTodos() {
        var listadoHorasRemove: any = [];
        var listHorasRemoveUntilExist: any = [];
        this.listHorasSelectedDerecha.forEach((horaId) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
                var objHora = this.listHorasSecondSelect[i];
                if (objHora['idCatalogo'] === horaId) {
                    objHoraSelected = objHora;
                    listHorasRemoveUntilExist.push(objHoraSelected);
                    i = this.listHorasSecondSelect.length;
                }
            }
            for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
                var objLeftHora = this.listHorasFirstSelect[i];
                if (
                    objHoraSelected['descripcionCatalogo'] ==
                    objLeftHora['descripcionCatalogo']
                ) {
                    banderaExist = true;
                    i = this.listHorasFirstSelect.length;
                }
            }
            if (!banderaExist) {
                listadoHorasRemove.push(objHoraSelected);
            }
        });
        this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
            this.listHorasFirstSelect,
            listadoHorasRemove
        );
        //[...this.listHorasFirstSelect,...listadoHorasRemove];
        //Se eliminan los elementos seleccionados
        listHorasRemoveUntilExist.forEach((option: any) => {
            this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
                (ele: any) => {
                    return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
                }
            );
        });
        //this.listHorasSelectedDerecha = [];
    }
    validateAndRemoveCuentaToRigthWithOutSelectedTodos() {
        var listadoCuentasRemove: any = [];
        var listCuentasRemoveUntilExist: any = [];
        this.listCuentasSelectedDerecha.forEach((horaId) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
                var objHora = this.listCuentasSecondSelect[i];
                if (objHora['idContratoCuenta'] === horaId) {
                    objHoraSelected = objHora;
                    listCuentasRemoveUntilExist.push(objHoraSelected);
                    i = this.listCuentasSecondSelect.length;
                }
            }
            for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
                var objLeftHora = this.listCuentasFirstSelect[i];
                if (
                    objHoraSelected['numCuenta'] ==
                    objLeftHora['numCuenta']
                ) {
                    banderaExist = true;
                    i = this.listCuentasFirstSelect.length;
                }
            }
            if (!banderaExist) {
                listadoCuentasRemove.push(objHoraSelected);
            }
        });
        this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
            this.listCuentasFirstSelect,
            listadoCuentasRemove
        );
        //[...this.listHorasFirstSelect,...listadoHorasRemove];
        //Se eliminan los elementos seleccionados
        listCuentasRemoveUntilExist.forEach((option: any) => {
            this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
                (ele: any) => {
                    return ele['numCuenta'] != option['numCuenta'];
                }
            );
        });

    }

    ordenateListForFirstSelectOrSecond(
        listadooriginal: any,
        listadoAgregar: any
    ) {
        var listadoComplete: any = [...listadooriginal, ...listadoAgregar];

        listadoComplete.sort((a: any, b: any) => {
            var numberValidate: number = 0;
            let objHoraA = a['descripcionCatalogo'];
            let objHoraB = b['descripcionCatalogo'];

            if (objHoraA < objHoraB) {
                numberValidate = -1;
            }

            if (objHoraA > objHoraB) {
                numberValidate = 1;
            }

            return numberValidate;
        });

        return listadoComplete;
    }

    ordenateListForFirstSelectOrSecondCuenta(
        listadooriginal: any,
        listadoAgregar: any
    ) {
        var listadoComplete: any = [...listadooriginal, ...listadoAgregar];

        listadoComplete.sort((a: any, b: any) => {
            var numberValidate: number = 0;
            let objHoraA = a['numCuenta'];
            let objHoraB = b['numCuenta'];

            if (objHoraA < objHoraB) {
                numberValidate = -1;
            }

            if (objHoraA > objHoraB) {
                numberValidate = 1;
            }

            return numberValidate;
        });

        return listadoComplete;
    }

    limpiar() {
        this.cuentaIntradia.negativos = false;
        this.cuentaIntradia.consolidado = false
        this.cuentaIntradia.intradia = false
        this.cuentaIntradia.xDivisa = false
        this.cuentaIntradia.tipoFormato = ''
        this.cuentaIntradia.canalEntrega = '1'
        this.cuentaIntradia.anulaciones = false
        this.cuentaIntradia.clabeVitual = false
        this.validateAndRemoveHoraToRigthSideSelectedTodos();
        this.validateAndRemoveCuentaToRigthSideSelectedTodos();
    }

    limpiar2() {
        this.cuentaIntradia.negativos = false;
        this.cuentaIntradia.consolidado = false
        this.cuentaIntradia.intradia = false
        this.cuentaIntradia.xDivisa = false
        this.cuentaIntradia.tipoFormato = ''
        this.cuentaIntradia.canalEntrega = '1'
        this.cuentaIntradia.anulaciones = false
        this.cuentaIntradia.clabeVitual = false
    }


    guardar() {
        this.getSelectedIdsFromListaHorasDerechaDefault();
        this.getSelectedIdsFromListacuentasDerechaDefault();
        if (this.validarFrecuencia()) {
            if (this.validarContenido()) {
                this.otra()
            }
        }
    }

    otra() {
        if (this.cuentaIntradia.tipoFormato.toString() !== this.idFormatoMT942 &&
            this.cuentaIntradia.canalEntrega === this.idCanalSwiftFin.toString()) {
            return this.open(
                this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF00016Titulo'),
                this.translate.instant('MT9402'),
                'alert',
                'INF00020',
                this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF00016Sugerencia')
            );
        } else {
            this.seguro();
        }
    }


    listIdsSelectedDerecha: number[] = [];
    listIdsSelectedDerecha2: number[] = [];
    getSelectedIdsFromListacuentasDerechaDefault() {
        this.listIdsSelectedDerecha = [];

        this.listCuentasSecondSelect.forEach((cuenta: any) => {
            this.listIdsSelectedDerecha.push(cuenta['idContratoCuenta'].toString());
        });

    }
    seguro() {
        let titulo = this.translate.instant('modals.parametros.confirmacion');
        let contenido = this.translate.instant('modals.parametros.confirmacion.contenido');
        const dialogo = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'),
        });
        dialogo.afterClosed().subscribe((result) => {
            if (result) {
                this.envio()
            }
        });
    }

    getSelectedIdsFromListaHorasDerechaDefault() {
        this.listIdsSelectedDerecha2 = [];
        this.listHorasSecondSelect.forEach((hora: any) => {
            this.listIdsSelectedDerecha2.push(hora['idCatalogo']);
        });
    }
    horaR: any[] = []
    async envio() {
        this.horaR = [];
        this.listHorasSecondSelectRespaldo.forEach((hora: any) => {
            this.horaR.push(hora['idCatalogo']);
        });

        var frecuencuas: any = []

        if (this.cuentaIntradia.consolidado === true) {
            frecuencuas.push(1)
        } else {
            frecuencuas.push('-1')
        }
        if (this.cuentaIntradia.intradia === true) {
            frecuencuas.push(2)
        } else {
            frecuencuas.push('-1')
        }
        frecuencuas.push('-1')
        frecuencuas.push('-1')
        frecuencuas.push('-1')
        frecuencuas.push('-1')

        if (this.cuentaIntradia.intradia === false) {
            this.listIdsSelectedDerecha2 = []  // listo
        }

        const guardar = {
            folioEnc: this.cuentaIntradia.folio,//listo
            chkConsolidadoPorDia: '3', //Listo
            chkSemanal: '4',//listo
            selDia: '', //Listo
            chkQuincenal: "5", //listo
            chkMensual: "6", //listo
            recibirArchivoPorTipoAgrupacion: this.cuentaIntradia.radio, //listo
            selCuentaH: this.listIdsSelectedDerecha.toString(), //listo
            selFormatoArchivo: this.cuentaIntradia.tipoFormato, // listo
            selFrecuenciasH: frecuencuas.toString(),  //
            old_selFrecuenciasH: this.cuentaIntradia.oldFrecuancia,//
            old_selHoraH: this.horaR.toString(), //listo
            old_selSemanalDiaH: '', //listo  //this.cuentaIntradia.diaViejo.toString(),
            old_selTipoArchivoRecibidoH: this.cuentaIntradia.radioAnterior.toString(), //listo
            old_selCuentaH: this.listIdsSelectedDerecha.toString(),  // Listo
            old_selFormatoArchivoH: this.cuentaIntradia.tipoFormatoViejo.toString(), // listo
            hdnBandSigNeg: this.cuentaIntradia.negativos === true ? 'A' : 'I', //listo
            hdnBandCtaClabe: this.cuentaIntradia.clabeVitual === true ? 'A' : 'I',//isto
            chkSignosNegativos: this.cuentaIntradia.negativos === true ? 'A' : 'I',  //listo
            selCanalEntrega: this.cuentaIntradia.canalEntrega.toString(),
            inicioPantallaConfEdoCta: this.inicioPantallaConfEdoCta, //listo
            dividirXDivisa: this.cuentaIntradia.xDivisa,//listo
            hdnContratoFolio: this.cuentaIntradia.folio, //listo
            idTabla: this.idTabla,
            anulaInd: {
                indicador: this.cuentaIntradia.anulaciones === true ? 'A' : 'I'//listo
            },
            selHora: this.listIdsSelectedDerecha2, // listo
            selHoraH: this.listIdsSelectedDerecha2.toString() // listo
        }

        try {
            await this.edoCuentaservice.guardaintradia(guardar).then(
                async (result: any) => {
                    if (result.message === 'ERR00C2') {
                        this.globals.loaderSubscripcion.emit(false);
                        this.open(
                            '',
                            this.translate.instant('EGECC'),
                            'error',
                            '',
                            ''
                        );
                    } else {
                        this.limpiar2()
                        this.horaEjecucion = result.horaEjecucion
                        this.initForm(1, '');
                    }
                });
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                '',
                this.translate.instant('EOIECII'),
                'error'
            );
        }
    }


    validarFrecuencia() {
        if (this.cuentaIntradia.consolidado === false && this.cuentaIntradia.intradia === false) {
            this.open(
                this.translate.instant('NNOFS'),
                this.translate.instant('SOF'),
                'alert',
                'INF00002',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        }
        if (this.cuentaIntradia.intradia === true) {
            if (this.listIdsSelectedDerecha2.length === 0) {
                this.open(
                    this.translate.instant('NHNOHS'),
                    this.translate.instant('SUOH'),
                    'alert',
                    'INF0002',
                    this.translate.instant('sugerencia')
                );
                return false
            } else {
                return true
            }
        }
        return true
    }

    validarContenido() {
        if (this.listIdsSelectedDerecha.length === 0) {
            this.open(
                this.translate.instant('NHNOCS'),
                this.translate.instant('SUOC'),
                'alert',
                'INF00004',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        }
        if (this.cuentaIntradia.tipoFormato === '') { // validar que haya cuentas de lado derecho
            this.open(
                this.translate.instant('NNOFAS'),
                this.translate.instant('SOFA'),
                'alert',
                'INF00006',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        } else {

            if (this.cuentaIntradia.canalEntrega === '') { // validar que haya cuentas de lado derecho
                this.open(
                    this.translate.instant('CE'),
                    this.translate.instant('ECEO'),
                    'alert',
                    'INF000015',
                    this.translate.instant('SUCE')
                );
                return false
            } else {
                return true
            }
        }
    }

    async exportar(tipoExportacion: any) {
        try {
            if (tipoExportacion === 'xlsx') {
                tipoExportacion = 'xls';
            }
            await this.edoCuentaservice.exportarIntradia(tipoExportacion, this.datosContrato.numContrato, this.usuarioActual).then(
                async (result: any) => {
                    if (result.data) {
                        /** Se manda la informacion para realizar la descarga del archivo */
                        this.fc.convertBase64ToDownloadFileInExport(result);
                        this.globals.loaderSubscripcion.emit(false);
                    } else {
                        if (result.code === '404') {
                            this.openModalError('Error', result.message, 'error');
                            this.globals.loaderSubscripcion.emit(false);
                        } else {
                            this.openModalError(
                                'Error',
                                this.translate.instant('OERE'),
                                'error'
                            );
                            this.globals.loaderSubscripcion.emit(false);
                        }
                        this.globals.loaderSubscripcion.emit(false);
                    }
                });
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                '',
                this.translate.instant('EE'),
                'error'
            );
        }

    }

    openModalError(
        titulo: string,
        obser: string,
        type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
        code?: string
    ) {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(titulo, obser, type, code),
        });
    }

    openModal() {
        const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
        dialogo.afterClosed().subscribe((result: any) => {
            if (result) {
                this.exportar(result);
            }
        });
    }

    open(
        titulo: string,
        obser: string,
        type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
        code?: string,
        sug?: string
    ) {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(titulo, obser, type, code, sug),
        });
    }


    resgistro1: any
    resgistro2: any
    assingListadoHoraSelect(result1: any, result2: any, listaHoras: any, horaIzquierda: any) {
        this.listHorasFirstSelect = listaHoras;
        this.listHorasFirstSelectRespaldo = listaHoras;
        this.listHorasSecondSelect = horaIzquierda;
        this.listHorasSecondSelectRespaldo = horaIzquierda;

        this.listCuentasFirstSelect = result2.registros;
        this.listCuentasFirstSelectRespaldo = result2.registros;
        this.listCuentasSecondSelect = result1.registros;
        this.listCuentasSecondSelectRespaldo = result1.registros;

        this.resgistro1 = result2
        this.resgistro2 = result1
        this._pageCount = this.resgistro1.paginasTotales
        this._pageCount1 = this.resgistro2.paginasTotales


    }

    async cuentasAgregar(tipo: any, lista: any): Promise<boolean> {
        this.cuentasE = []
        lista.forEach((cuenta: any) => {
            this.cuentasE.push(cuenta.numCuenta)
        })
        const cuentasEn = {
            "cuentaMov": this.cuentasE.toString(),
            "tipMovCta": tipo,
            "idContrato": this.datosContrato.idContrato,
            "numContrato": this.datosContrato.numContrato,
            "idTabla": this.idTabla,
            "inicioPantallaConfEdoCta": this.inicioPantallaConfEdoCta,
            "pagina1": 1, // a consultar
            "pagina2": 1 // actual
        }
        try {
            await this.edoCuentaservice.paginacionIntradia(cuentasEn).then((result: any) => {
                this.listCuentasSelectedIzquierda = [];
                this.pageIndex = 1
                this.pageIndex1 = 1
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2, result.listaHoras, result.listaGetConfEstadosCuenta.intradiaHoras);
                this.globals.loaderSubscripcion.emit(false);

            })
            return true
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
            return false;
        }
    }

    cuentasE: any = []
    cuentasR: any = []
    async cuentasRegresar(tipo: any, lista: any) {
        this.cuentasR = []
        lista.forEach((cuenta: any) => {
            this.cuentasR.push(cuenta.numCuenta)
        })
        const cuentasEn = {
            "cuentaMov": this.cuentasR.toString(),
            "tipMovCta": tipo,
            "idContrato": this.datosContrato.idContrato,
            "numContrato": this.datosContrato.numContrato,
            "idTabla": this.idTabla,
            "inicioPantallaConfEdoCta": this.inicioPantallaConfEdoCta,
            "pagina1": 1, // a consultar
            "pagina2": 1 // actual
        }
        try {
            await this.edoCuentaservice.paginacionIntradia(cuentasEn).then((result: any) => {
                this.listCuentasSelectedDerecha = [];
                this.pageIndex = 1
                this.pageIndex1 = 1
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2, result.listaHoras, result.listaGetConfEstadosCuenta.intradiaHoras);
                this.globals.loaderSubscripcion.emit(false);
            })
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
        }
    }

    _itemCount: number;
    get itemCount() {
        return this._itemCount;
    }
    set itemCount(value) {
        this._itemCount = value;
        this.updatePageCount();
    }

    _pageSize: number;
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = value;
        this.updatePageCount();
    }

    _pageCount: number;
    updatePageCount() {
        this._pageCount = this.resgistro1.paginasTotales
    }

    _pageIndex: number;
    pageIndexChange = new EventEmitter();
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = value;
    }

    get canMoveToNextPage(): boolean {
        return this.pageIndex < this._pageCount ? true : false;
    }

    get canMoveToPreviousPage(): boolean {
        return this.pageIndex >= 2 ? true : false;
    }

    moveToNextPage() {
        if (this.canMoveToNextPage) {
            this.pageIndex++;
            // consultar uno mas
            this.paginacion(this.pageIndex, this.pageIndex1)
        }
    }

    moveToPreviousPage() {
        if (this.canMoveToPreviousPage) {
            this.pageIndex--;
            var mas = this.pageIndex + 1
            // consultar uno menos
            this.paginacion(this.pageIndex, this.pageIndex1)
        }
    }

    moveToLastPage() {
        var actual = this.pageIndex
        this.pageIndex = this._pageCount;
        // consultar al ultimo
        this.paginacion(this.pageIndex, this.pageIndex1)
    }

    moveToFirstPage() {
        var actual = this.pageIndex
        this.pageIndex = 1;
        // consultar al inicio
        this.paginacion(this.pageIndex, this.pageIndex1)
    }

    /////////////



    _itemCount1: number;
    get itemCount1() {
        return this._itemCount1;
    }
    set itemCount1(value) {
        this._itemCount1 = value;
        this.updatePageCount1();
    }

    _pageSize1: number;
    get pageSize1() {
        return this._pageSize1;
    }
    set pageSize1(value) {
        this._pageSize1 = value;
        this.updatePageCount1();
    }

    _pageCount1: number = 0;
    updatePageCount1() {
        this._pageCount1 = this.resgistro2.paginasTotales
    }

    _pageIndex1: number;
    pageIndexChange1 = new EventEmitter();
    get pageIndex1() {
        return this._pageIndex1;
    }
    set pageIndex1(value) {
        this._pageIndex1 = value;
    }

    get canMoveToNextPage1(): boolean {
        return this.pageIndex1 < this._pageCount1 ? true : false;
    }

    get canMoveToPreviousPage1(): boolean {
        return this.pageIndex1 >= 2 ? true : false;
    }

    moveToNextPage1() {
        if (this.canMoveToNextPage1) {
            this.pageIndex1++;
            // consultar uno mas
            this.paginacion(this.pageIndex, this.pageIndex1)
        }
    }

    moveToPreviousPage1() {
        if (this.canMoveToPreviousPage1) {
            this.pageIndex1--;
            // consultar uno menos
            this.paginacion(this.pageIndex, this.pageIndex1)
        }
    }

    moveToLastPage1() {
        this.pageIndex1 = this._pageCount1;
        // consultar al ultimo
        this.paginacion(this.pageIndex, this.pageIndex1)
    }

    moveToFirstPage1() {
        this.pageIndex1 = 1;
        // consultar al inicio
        this.paginacion(this.pageIndex, this.pageIndex1)
    }
}
