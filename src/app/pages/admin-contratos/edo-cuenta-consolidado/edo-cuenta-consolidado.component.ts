import { ConditionalExpr } from '@angular/compiler';
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
    selector: 'app-edo-cuenta-consolidado',
    templateUrl: './edo-cuenta-consolidado.component.html',
    styleUrls: ['./edo-cuenta-consolidado.component.css']
})
export class EdoCuentaConsolidadoComponent implements OnInit {

    datos: any;

    listHorasSelectedIzquierda: string[] = [];
    /** contiene las horas seleccionadas */
    listHorasSelectedDerecha: string[] = [];
    /** Lista que contiene las horas */
    listHorasFirstSelect: any = [];
    listHorasFirstSelectRespaldo: any = [];
    listHorasSecondSelect: any = [];
    listHorasSecondSelectRespaldo: any = [];
    listaCuentas: any = [];
    request: any;
    radioItems: Array<string>;
    model = { option: 'option3' };
    validaProductoExistente = true;

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

    cuentaConsolidada: any = {
        dia: '',
        semanal: '',
        selectDia: '',
        quincenal: '',
        mensual: '',
        negativos: '',
        radio: '',
        tipoFormato: '',
        canalEntrega: '',
        clabeVitual: '',
        anulaciones: '',
        xDivisa: '',
        folio: '',
        diaViejo: '',
        radioAnterior: '',
        tipoFormatoViejo: '',
        oldFrecuencia: '',
    };

    seasons2 = [
        {
            name: "ConsolidadoCuentas",
            value: this.translate.instant('RACC'),
        },
        {
            name: "cuenta",
            value:  this.translate.instant('RAC'),
        }
    ];

    tiposFormatos: any
    canales: any;
    consolidadoPordia: any;
    radio1: any;
    radio2: any;
    dias: any
    respaldo: any;

    constructor(
        public dialog: MatDialog,
        private service: ComunesService,
        private globals: Globals,
        private edoCuentaservice: EdoCuentaService,
        private fc: FuncionesComunesComponent,
        private translate: TranslateService,
    ) {
        this.usuarioActual = localStorage.getItem('UserID');
        this.pageIndex= 1
        this.pageIndex1 = 1
    }

    ngOnInit(): void {
        this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 12) {
                this.limpiarContrato();
                this.initForm(0,'');
            }
        });
    }
    async initForm(valo?:any,idTabla2?:any) {
        this.datos = this.service.datosContrato;
        this.datosContrato = this.datos;
        if (this.datos !== undefined) {
            this.datosContrato.bucCliente = this.datos.bucCliente;
            await this.getDatos(this.datos.numContrato,valo,idTabla2);
            this.pageIndex= 1
            this.pageIndex1 = 1
        }
    }
    inicioPantallaConfEdoCta:any
    idTabla:any
    async getDatos(numContrato: any, valo?:any, idTabla1?:any) {
        try {
            await this.edoCuentaservice.getConsolidado(numContrato,idTabla1).then((result: any) => {
                if (result.message) {
                    this.cuentaConsolidada.semanal = false
                    this.verMensajeErrorSoliEdoCta(result.message)
                    this.globals.loaderSubscripcion.emit(false);
                    return
                } else {
                    if(idTabla1 !== ''){
                        this.inicioPantallaConfEdoCta = 1
                    }else{
                        this.inicioPantallaConfEdoCta = 0
                    }
                    this.idTabla = result.listaGetConfEstadosCuenta.idTablaTmp;
                    this.patchValue(result);
                    this.inhabiitar(result);
                    //this.paginacion(result);
                    this.validaSepararDivisasSolEdoCta();
                    this.globals.loaderSubscripcion.emit(false);
                    if(valo===1){
                        this.open(
                            this.translate.instant('SGC'),
                            '',
                            'info',
                            '',
                            ''
                        );
                    }
                }
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

    async paginacion(pageConsultar:any, pageActual?:any){
        var es= {
            "cuentaMov":"",
            "tipMovCta":"",
            "idContrato":this.datosContrato.idContrato,
        	"numContrato":this.datosContrato.numContrato,
        	"idTabla":this.idTabla,
        	"inicioPantallaConfEdoCta":this.inicioPantallaConfEdoCta,
            "pagina1":pageConsultar, // a consultar
            "pagina2":pageActual // actual
            }
        try{
            await this.edoCuentaservice.paginacionconsolidado(es).then((result: any)=>{
                //this.limpiarContrato();
                //this.initForm(0);
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.idTabla = result.listaGetConfEstadosCuenta.idTablaTmp
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2);
                this.globals.loaderSubscripcion.emit(false);  
            })
        }catch(e){
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
        }
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


    inhabiitar(data: any) {
        if (data.listaGetConfEstadosCuenta.banderaProductoEdoCta === 'N') {
            this.inhabilitarCuandoCancelado('CANCEL');
        }
        /*if(data.listaGetConfEstadosCuenta.banderaProductoEdoCta === 'N' || data.listaGetConfEstadosCuenta.banderaProdEdoCtaActivo ){
          this.inhabilitarCuandoCancelado('CANCEL');
        }*/
        
        if((data.listaGetConfEstadosCuenta.banderaProductoEdoCuenta != null && data.listaGetConfEstadosCuenta.banderaProductoEdoCuenta != undefined) && data.listaGetConfEstadosCuenta.banderaProductoEdoCuenta == "N"){
            this.inhabilitarCuandoNoExisteProducto();
        }
    }

    inhabilitarCuandoCancelado(dato: any) {
        if (dato == 'CANCEL') {
            this.toggleDisable()
        }
    }

    inhabilitarCuandoNoExisteProducto(){
        /** Inhabilita pantalla **/
        this.disablecheckdia = true;
        this.cuentaConsolidada.dia = true;
        this.cuentaConsolidada.semanal = true;
        this.disablecheckSemanal = true;
        this.cuentaConsolidada.selectDia = ''
        this.cuentaConsolidada.semanal = true;
        this.cuentaConsolidada.quincenal = true;
        this.disablecheckQuincenal = true;
        this.cuentaConsolidada.mensual = true;
        this.disablecheckMensual = true;
        this.esconderDivisa = true;

        this.disableTextbox = true;
        this.disablecheckdia = true;
        this.disablecheckSemanal = true;
        this.disablecheckSelectDia = true;
        this.disablecheckQuincenal = true;
        this.disablecheckMensual = true;
        this.validaProductoExistente = false;
        /*** Mensaje de producto no existente ***/
        this.open(
            this.translate.instant('NEPEC'),
            this.translate.instant('PAPP'),
            'alert',
            'INF000013',
            this.translate.instant('sugerencia')
        );
        return false;
    }

    disableTextbox = false;
    disablecheckdia = false
    disablecheckSemanal = false
    disablecheckSelectDia = false
    disablecheckQuincenal = false
    disablecheckMensual = false
    toggleDisable() {
        this.disableTextbox = !this.disableTextbox;
    }

    esconderDivisa: any
    validaSepararDivisasSolEdoCta() {
        const hayDiferentesdivisas = this.hayDiferentesdivisas
        let check = this.radio1
        if (check) {
            if (hayDiferentesdivisas !== '' && parseInt(hayDiferentesdivisas) > 1) {
                if (this.cuentaConsolidada.tipoFormato === this.idFormatoMT940) {
                    this.esconderDivisa = false

                } else if (this.cuentaConsolidada.tipoFormato === this.idFormatoMT940D) {
                    this.esconderDivisa = false
                } else if (this.cuentaConsolidada.tipoFormato === this.idFormatoMT942) {
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

    idFormatoMT940: any
    idFormatoMT940D: any
    idCanalSwiftFin: any
    idFormatoMovPeriodo: any
    idFormatoMT942: any
    hayDiferentesdivisas: any
    patchValue(datos: any){
        this.tiposFormatos = datos.listaFormatosArchivo;
        this.canales = datos.canalesCntr;
        this.dias = datos.listaDias
        this.cuentaConsolidada.radio = datos.listaGetConfEstadosCuenta.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo;
        this.cuentaConsolidada.dia = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[2].idCatalogo)
        this.respaldo=  this.cuentaConsolidada.radio 
        this.cuentaConsolidada.semanal = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[3].idCatalogo)
        this.cuentaConsolidada.quincenal = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[4].idCatalogo)
        this.cuentaConsolidada.mensual = datos.listaGetConfEstadosCuenta.frecuenciasId.includes(datos.listaDispFrecuencias[5].idCatalogo)

        if(this.cuentaConsolidada.radio === null){
            this.radio1 = false
            this.radio2 = false
            this.cuentaConsolidada.xDivisa = false
        }else{
            this.radio1 = (this.cuentaConsolidada.radio.includes(datos.tipoRecepcion[0]) || this.cuentaConsolidada.radio.includes('D'))
            this.radio2 = this.cuentaConsolidada.radio.includes(datos.tipoRecepcion[1])
            this.cuentaConsolidada.xDivisa =  this.cuentaConsolidada.radio.includes('D')
        }

        this.cuentaConsolidada.negativos = datos.signosNegativosMostrar === 'A' ? true : false;
        this.cuentaConsolidada.selectDia = datos.listaGetConfEstadosCuenta.semanalDia.idCatalogo
        this.cuentaConsolidada.diaViejo = this.cuentaConsolidada.selectDia
        this.cuentaConsolidada.anulaciones = datos.anulaInd.indicador === 'A' ? true : false || false
        this.cuentaConsolidada.clabeVitual = datos.cuentaClabeMostrar === 'A' ? true : false
        this.assingListadoHoraSelect(datos.respuesta1, datos.respuesta2);
        this.cuentaConsolidada.folio = datos.folioEnc
        this.cuentaConsolidada.radioAnterior = this.cuentaConsolidada.radio
        this.cuentaConsolidada.tipoFormato = datos.listaGetConfEstadosCuenta.tipoFormato.idCatalogo
        this.cuentaConsolidada.tipoFormatoViejo = this.cuentaConsolidada.tipoFormato
        this.cuentaConsolidada.canalEntrega = datos.listaGetConfEstadosCuenta.idCanalEntrega
        this.cuentaConsolidada.oldFrecuancia = datos.listaGetConfEstadosCuenta.frecuenciasId
        // tipoFormato falta nuevo y viejo

        if (this.cuentaConsolidada.selectDia === undefined) {
            this.cuentaConsolidada.selectDia = 0
        }
        this.idFormatoMT940 = datos.idFormatoMT940
        this.idFormatoMT940D = datos.idFormatoMT940D
        this.idCanalSwiftFin = datos.idCanalSwiftFin
        this.idFormatoMovPeriodo = datos.idFormatoMovPeriodo
        this.idFormatoMT942 = datos.idFormatoMT942
        this.hayDiferentesdivisas = datos.hayDiferentesdivisas

        if (this.cuentaConsolidada.radio === undefined || this.cuentaConsolidada.radio === '' || this.cuentaConsolidada.radio === null || this.cuentaConsolidada.radio === 'D') {
            this.cuentaConsolidada.radio = 'C'
        }
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    limpiarContrato() {
        this.cuentaConsolidada = {
            dia: '',
            semanal: false,
            selectDia: '',
            quincenal: '',
            mensual: '',
            negativos: '',
            radio: 'P',
            tipoFormato: '',
            canalEntrega: '1',
            clabeVitual: '',
            anulaciones: '',
            tipoFormatoViejo: '',
            oldFrecuancia: ''
        };
        this.validateAndRemoveHoraToRigthSideSelectedTodos();
    }

    limpiarContrato2() {
        this.cuentaConsolidada = {
            dia: '',
            semanal: false,
            selectDia: '',
            quincenal: '',
            mensual: '',
            negativos: '',
            radio: 'P',
            tipoFormato: '',
            canalEntrega: '1',
            clabeVitual: '',
            anulaciones: '',
            tipoFormatoViejo: '',
            oldFrecuancia: ''
        };
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
        this.disablecheckdia = false
        this.disablecheckSemanal = false
        this.disablecheckQuincenal = false
        this.disablecheckMensual = false
    }

    inhabilitarPorFormatoMovPeriodo() {
        this.disablecheckdia = true
        this.disablecheckSemanal = false
        this.cuentaConsolidada.semanal = true
        this.disablecheckQuincenal = false
        this.disablecheckMensual = false

    }
    inhabilitarPorFormatoMT940() {
        this.disablecheckdia = false
        this.cuentaConsolidada.semanal = false
        this.disablecheckSemanal = true
        this.cuentaConsolidada.selectDia = ''
        this.cuentaConsolidada.semanal = false
        this.cuentaConsolidada.quincenal = false
        this.disablecheckQuincenal = true
        this.cuentaConsolidada.mensual = false
        this.disablecheckMensual = true
        this.esconderDivisa = false
    }
    inhabilitarPorFormatoMT940D() {
        this.disablecheckdia = false
        this.cuentaConsolidada.semanal = false
        this.disablecheckSemanal = true
        this.cuentaConsolidada.selectDia = ''
        this.cuentaConsolidada.semanal = false
        this.cuentaConsolidada.quincenal = false
        this.disablecheckQuincenal = true
        this.cuentaConsolidada.mensual = false
        this.disablecheckMensual = true
        this.esconderDivisa = false
    }
    inhabilitarPorFormatoMT942() {
        this.disablecheckdia = true
        this.cuentaConsolidada.dia = false
        this.cuentaConsolidada.semanal = false
        this.disablecheckSemanal = true
        this.cuentaConsolidada.selectDia = ''
        this.cuentaConsolidada.semanal = false
        this.cuentaConsolidada.quincenal = false
        this.disablecheckQuincenal = true
        this.cuentaConsolidada.mensual = false
        this.disablecheckMensual = true
        this.esconderDivisa = false
    }

    /// vamos Aqui revisando de Intradia para pasar
    async guardar() {
        this.getSelectedIdsFromListaHorasDerechaDefault();
        if (this.validarFrecuencia()) {
            if (this.validarContenido()) {
                this.validacionesOtras()
                this.seguro();
            }
        }
    }

    validacionesOtras() {
        if (this.cuentaConsolidada.dia === true) {
            if (this.cuentaConsolidada.tipoFormato !== this.idFormatoMT940 &&
                this.cuentaConsolidada.tipoFormato !== this.idFormatoMT940D &&
                this.cuentaConsolidada.canalEntrega === this.idCanalSwiftFin) {
                this.open(
                    this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF00016Titulo'),
                    this.translate.instant('MT940'),
                    'alert',
                    'INF00020',
                    this.translate.instant('pantalla.reporteCobranzaConsolidado.msjINF00016Sugerencia')
                );
                return

            }
        }
    }

    seguro() {
        let titulo = this.translate.instant(
            'modals.parametros.confirmacion'
        );
        let contenido = this.translate.instant(
            'modals.parametros.confirmacion.contenido'
        );
        const dialogo = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'),
        });
        dialogo.afterClosed().subscribe((result) => {
            if (result) {
                this.envio()
            }
        });
    }
    horaR: any[] = []
    async envio() {
        var idContratosCuantasEnviar: any = []
        this.listHorasSecondSelect.forEach(function (value: any) {
            idContratosCuantasEnviar.push(value.idContratoCuenta)
        });
        this.horaR = [];
        this.listHorasSecondSelectRespaldo.forEach((hora: any) => {
            this.horaR.push(hora['idCatalogo']);
        });
        var frecuencuas: any = []
        frecuencuas.push('-1')
        frecuencuas.push('-1')
        if (this.cuentaConsolidada.dia === true) {
            frecuencuas.push(3)
        } else {
            frecuencuas.push('-1')
        }
        if (this.cuentaConsolidada.semanal === true) {
            frecuencuas.push(4)
        } else {
            frecuencuas.push('-1')
        }
        if (this.cuentaConsolidada.quincenal === true) {
            frecuencuas.push(5)
        } else {
            frecuencuas.push('-1')
        }
        if (this.cuentaConsolidada.mensual === true) {
            frecuencuas.push(6)
        } else {
            frecuencuas.push('-1')
        }

        const guardar = {
            folioEnc: this.cuentaConsolidada.folio, //ok
            chkConsolidadoPorDia: '3', // ok
            chkSemanal: '4', //ok
            selDia: this.cuentaConsolidada.selectDia.toString(), // dia de la semana seleccionado ok
            chkQuincenal: "5", //ok
            chkMensual: "6", //ok
            recibirArchivoPorTipoAgrupacion: this.cuentaConsolidada.radio, // tipo de radio selecciondo ok
            selCuentaH: idContratosCuantasEnviar.toString(), // cuentas nuevas ok
            selFormatoArchivo: this.cuentaConsolidada.tipoFormato,  //ok
            selFrecuenciasH: frecuencuas.toString(), // frecuencias nuevas ok
            old_selHoraH: this.horaR.toString(),
            old_selFrecuenciasH: this.cuentaConsolidada.oldFrecuancia, // frecuencias seleccionadas al inicio ok
            old_selSemanalDiaH: this.cuentaConsolidada.diaViejo.toString(),  // dia anterior seleccionado ok
            old_selTipoArchivoRecibidoH: this.cuentaConsolidada.radioAnterior,
            old_selCuentaH: idContratosCuantasEnviar.toString(),  // cuentas Anteriores ok
            old_selFormatoArchivoH: this.cuentaConsolidada.tipoFormatoViejo.toString(),  // ok
            hdnBandSigNeg: this.cuentaConsolidada.negativos === true ? 'A' : 'I',
            hdnBandCtaClabe: this.cuentaConsolidada.clabeVitual === true ? 'A' : 'I',
            chkSignosNegativos: this.cuentaConsolidada.negativos === true ? 'A' : 'I',
            selCanalEntrega: this.cuentaConsolidada.canalEntrega, // ok
            inicioPantallaConfEdoCta:this.inicioPantallaConfEdoCta,
            dividirXDivisa: this.cuentaConsolidada.xDivisa, // ok
            hdnContratoFolio: this.cuentaConsolidada.folio, // ok
            idTabla:this.idTabla,
            anulaInd: {
                indicador: this.cuentaConsolidada.anulaciones === true ? 'A' : 'I' // ok
            },
            selHora: [],
            selHoraH: ''
        }
        try {
            await this.edoCuentaservice.guardar(guardar).then(
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
                        this.limpiarContrato();
                        this.initForm(1,this.idTabla);
                    }
                });
        } catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                '',
                this.translate.instant('EOIECI'),
                'error'
            );
        }
    }

    /**
     * Metodo para poder obtener el listado de los ids
     * de las horas que se establecieron en la lista de select
     * del lado derecho
     */
    /** Lista que contendra los ids del select derecho */
    listIdsSelectedDerecha: number[] = [];
    getSelectedIdsFromListaHorasDerechaDefault() {
        this.listIdsSelectedDerecha = [];
        this.listHorasSecondSelect.forEach((hora: any) => {
            this.listIdsSelectedDerecha.push(hora['idContratoCuenta']);
        });
    }


    validarFrecuencia() {
        if (this.cuentaConsolidada.dia == '' && this.cuentaConsolidada.semanal == '') {
            this.open(
                this.translate.instant('NNOFS'),
                this.translate.instant('SOF'),
                'alert',
                'INF00002',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        }
        else {
            if (this.cuentaConsolidada.semanal === true) {
                if (this.cuentaConsolidada.selectDia == '') {
                    this.open(
                        this.translate.instant('NHNODS'),
                        this.translate.instant('SOD'),
                        'alert',
                        'INF00005',
                        this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
                    );
                    return false
                }
            }
            return true
        }
    }

    validarContenido() {
        if (this.listHorasSecondSelect.length === 0) {
            this.open(
                this.translate.instant('NHNOCS'),
                this.translate.instant('SUOC'),
                'alert',
                'INF00004',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        }

        if (this.cuentaConsolidada.tipoFormato === '') { // validar que haya cuentas de lado derecho
            this.open(
                this.translate.instant('NNOFAS'),
                this.translate.instant('SOFA'),
                'alert',
                'INF00006',
                this.translate.instant('modals.edoCuentaConsolidado.error.sugerencia')
            );
            return false
        } else {

            if (this.cuentaConsolidada.canalEntrega === '') { // validar que haya cuentas de lado derecho
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

    cambio(dato:any){
        if(dato.value === 'P'){
            this.esconderDivisa = false
        }else{
            this.cuentaConsolidada.xDivisa =  this.respaldo.includes('D')
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
                var idContratosCuantasEnviar: any = []
                this.listHorasSecondSelect.forEach(function (value: any) {
                    idContratosCuantasEnviar.push(value)
                });
                this.cuentasAgregar('SA', idContratosCuantasEnviar)
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                this.validateAndAddHoraToRigthWithOutSelectedTodos();
                this.cuentasAgregar('SA',this.listHorasSelectedIzquierda)
            }
        }
    }

    cuentasE:any = []
    async cuentasAgregar(tipo: any, lista:any) {
        this.cuentasE=[]
        lista.forEach((cuenta:any) => {
            this.cuentasE.push(cuenta.numCuenta)
        })
        const cuentasEn ={
            "cuentaMov":this.cuentasE.toString(),
        	"tipMovCta":tipo,
        	"idContrato":this.datosContrato.idContrato,
        	"numContrato":this.datosContrato.numContrato,
        	"idTabla":this.idTabla,
        	"inicioPantallaConfEdoCta":this.inicioPantallaConfEdoCta,
            "pagina1":1, // a consultar
            "pagina2":1 // actual
        }
        try {
            await this.edoCuentaservice.paginacionconsolidado(cuentasEn).then((result: any) => {
                this.pageIndex= 1
                this.pageIndex1 = 1
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.listHorasSelectedIzquierda = [];
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2);
                this.globals.loaderSubscripcion.emit(false);
            })
        }catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
        }
    }

    cuentasR:any =[]
    async cuentasRegresar(tipo: any, lista:any) {
        this.cuentasR=[]
        lista.forEach((cuenta:any) => {
            this.cuentasR.push(cuenta.numCuenta)
        })
        const cuentasEn ={
            "cuentaMov":this.cuentasR.toString(),
        	"tipMovCta":tipo,
        	"idContrato":this.datosContrato.idContrato,
        	"numContrato":this.datosContrato.numContrato,
        	"idTabla":this.idTabla,
        	"inicioPantallaConfEdoCta":this.inicioPantallaConfEdoCta,
            "pagina1":1, // a consultar
            "pagina2":1 // actual
        }
        try {
            await this.edoCuentaservice.paginacionconsolidado(cuentasEn).then((result: any) => {
                this.pageIndex= 1
                this.pageIndex1 = 1
                this.inicioPantallaConfEdoCta = result.inicioPantallaConfEdoCta
                this.listHorasSelectedDerecha = [];
                this.assingListadoHoraSelect(result.respuesta1, result.respuesta2);
                this.globals.loaderSubscripcion.emit(false);
            })
        }catch (e) {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
                'Error',
                this.translate.instant('Error.EDO'),
                'error'
            );
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
                var idContratosCuantasEnviar: any = []
                this.listHorasFirstSelect.forEach(function (value: any) {
                    idContratosCuantasEnviar.push(value)
                });
                
                this.cuentasRegresar('NA', idContratosCuantasEnviar);
            } else {
                //Se selecciono 1 o mas opciones excepto el todos
                this.validateAndRemoveHoraToRigthWithOutSelectedTodos();
                this.cuentasRegresar('NA', this.listHorasSelectedDerecha);
            }
            this.cleanCheckbox();
        }
    }

    cleanCheckbox() {
        this.cuentaConsolidada.dia = false;
        this.cuentaConsolidada.semanal = false;
        this.cuentaConsolidada.selectDia = '';
        this.cuentaConsolidada.quincenal = false;
        this.cuentaConsolidada.mensual = false;
        this.cuentaConsolidada.negativos = false;
    }

    /**
    * Metodo para validar si la hora del lado izquierdo
    * ya existe o no en la lista de horas del lado derecho
    * cuando se selecciona la opcion de todos
    */
    validateAndAddHoraToRigthSideSelectedTodos() {
        //Se selecciono la opcion todos
        
        this.listHorasSecondSelect =[]
        var listadoHorasAdd: any = [];
        var listHorasRemoveUntilExist: any = [];
        for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
            var objLeftHora = this.listHorasFirstSelect[i];
            listHorasRemoveUntilExist.push(objLeftHora);
            var banderaExist = false;
            for (var j = 0; j < this.listHorasSecondSelect.length; j++) {
                var objRightHora = this.listHorasSecondSelect[j];
                if (
                    objLeftHora['numCuenta'] ==
                    objRightHora['numCuenta']
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
                    objRigthtHora['numCuenta'] ==
                    objLeftHora['numCuenta']
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
        this.listHorasSelectedIzquierda.forEach((horaId:any) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
                var objHora = this.listHorasFirstSelect[i];
                if (objHora['idContratoCuenta'] === horaId.idContratoCuenta) {
                    objHoraSelected = objHora;
                    listHorasRemoveUntilExist.push(objHoraSelected);
                    i = this.listHorasFirstSelect.length;
                }
            }
            for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
                var objRightHora = this.listHorasSecondSelect[i];
                if (
                    objHoraSelected['numCuenta'] ==
                    objRightHora['numCuenta']
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
                    return ele['numCuenta'] != option['numCuenta'];
                }
            );
        });
    }


    validateAndRemoveHoraToRigthWithOutSelectedTodos() {
        var listadoHorasRemove: any = [];
        var listHorasRemoveUntilExist: any = [];
        this.listHorasSelectedDerecha.forEach((horaId:any) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
                var objHora = this.listHorasSecondSelect[i];
                if (objHora['idContratoCuenta'] === horaId.idContratoCuenta) {
                    objHoraSelected = objHora;
                    listHorasRemoveUntilExist.push(objHoraSelected);
                    i = this.listHorasSecondSelect.length;
                }
            }
            for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
                var objLeftHora = this.listHorasFirstSelect[i];
                if (
                    objHoraSelected['numCuenta'] ==
                    objLeftHora['numCuenta']
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

    async exportar(tipoExportacion: any) {
        try {
            if (tipoExportacion === 'xlsx') {
                tipoExportacion = 'xls';
            }
            await this.edoCuentaservice.exportarConsolidado(tipoExportacion, this.datosContrato.numContrato, this.usuarioActual).then(
                async(result: any) => {
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
    resgistro1:any
    resgistro2:any
    assingListadoHoraSelect(result1: any, result2: any) {
        this.listHorasFirstSelect = result2.registros;
        this.resgistro1= result2
        this.listHorasFirstSelectRespaldo = result2.registros;
        this.listHorasSecondSelect = result1.registros;
        this.listHorasSecondSelectRespaldo = result1.registros;
        this.resgistro2= result1
        this._pageCount=this.resgistro1.paginasTotales
        this._pageCount1 = this.resgistro2.paginasTotales
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
  
    get canMoveToNextPage() : boolean {
      return this.pageIndex < this._pageCount ? true : false;
    }
  
    get canMoveToPreviousPage() : boolean {
      return this.pageIndex >= 2 ? true : false;
    }
  
    moveToNextPageT() {
      if (this.canMoveToNextPage) {
        this.pageIndex++;
        var menos = this.pageIndex-1 
        // consultar uno mas
        this.paginacion(this.pageIndex, this.pageIndex1)
      }
    }
  
    moveToPreviousPageT() {
      if (this.canMoveToPreviousPage) {
        this.pageIndex--;
        var mas = this.pageIndex+1
        // consultar uno menos
        this.paginacion(this.pageIndex, this.pageIndex1)
      }
    }
  
    moveToLastPageT() {
        var actual = this.pageIndex 
      this.pageIndex = this._pageCount;
      // consultar al ultimo
      this.paginacion(this.pageIndex, this.pageIndex1 )
    }
  
    moveToFirstPageT() {
        var actual= this.pageIndex
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
  
    _pageCount1: number;
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
  
    get canMoveToNextPage1() : boolean {
      return this.pageIndex1 < this._pageCount1 ? true : false;
    }
  
    get canMoveToPreviousPage1() : boolean {
      return this.pageIndex1 >= 2 ? true : false;
    }
  
    moveToNextPage1T() {
      if (this.canMoveToNextPage1) {
        this.pageIndex1++;
        // consultar uno mas
        this.paginacion(this.pageIndex, this.pageIndex1)
      }
    }
  
    moveToPreviousPage1T() {
      if (this.canMoveToPreviousPage1) {
        this.pageIndex1--;
        // consultar uno menos
        this.paginacion(this.pageIndex, this.pageIndex1)
      }
    }
  
    moveToLastPage1T() {
      this.pageIndex1 = this._pageCount1;
      // consultar al ultimo
      this.paginacion(this.pageIndex, this.pageIndex1)
    }
  
    moveToFirstPage1T() {
      this.pageIndex1 = 1;
      // consultar al inicio
      this.paginacion(this.pageIndex, this.pageIndex1)

    }
}
