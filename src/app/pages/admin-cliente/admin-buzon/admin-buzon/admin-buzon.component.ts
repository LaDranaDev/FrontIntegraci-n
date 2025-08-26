import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ComunesService } from 'src/app/services/comunes.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { Subscription } from 'rxjs';
import { DatosBuzonRequest } from 'src/app/bean/datos-buzon-bean.component';
import { differenceInDays, format, parse } from 'date-fns';
import { AdminBuzonService } from 'src/app/services/admin-cliente/admin-buzon.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Component({
    selector: 'app-admin-buzon',
    templateUrl: './admin-buzon.component.html',
    styleUrls: ['./admin-buzon.component.css']
})
export class AdminBuzonComponent implements OnInit {
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
    items: any[];
    filtros: any;
    datosBuzonRequest: DatosBuzonRequest;
    banderaTabla: boolean = false;
    usuarioActual: string | null = '';
    page: number = 0;
    totalElements: number = 0;
    rowsPorPagina: number = 20;
    clickSuscliption: Subscription | undefined;
    objPageable: IPaginationRequest;
    

    constructor(public dialog: MatDialog,
        private translate: TranslateService,
        public datePipe: DatePipe,
        private globals: Globals,
        private fc: FuncionesComunesComponent,
        private adminBuzonService: AdminBuzonService,
        private comunService: ComunesService) {
        this.datosBuzonRequest = new DatosBuzonRequest();
        this.datosBuzonRequest.fechaInicio = new Date() as unknown as string;
        this.datosBuzonRequest.fechaFin = new Date() as unknown as string;
        this.usuarioActual = localStorage.getItem('UserID');

        //Se inicializa el objeto pageable
        this.objPageable = {
            page: this.page,
            size: this.rowsPorPagina,
        }
    }


    ngOnInit(): void {
        this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 3) {
                //this.onClickLimpiar();
                this.consultaQuery(true);
            }
        });
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    consultaDatosCliente() {
        this.datosBuzonRequest.contrato = "";
        this.items = [];
        this.banderaTabla = false;

        if (this.datosBuzonRequest.codigoCliente != "") {
            this.adminBuzonService.getDatosCliente(
                this.datosBuzonRequest.codigoCliente
            ).then(resp => {
                if (resp.codError === "OK00000") {
                    this.datosBuzonRequest.contrato = resp.numContrato;
                    this.datosBuzonRequest.idContrato = resp.idContrato;
                }
            }).catch(() => {
                this.getDialogModal('error', 
                    'modal.msjERRGEN0001Titulo', 'modal.msjERRGEN0001Observacion',
                    'modal.msjERRGEN0001Codigo', 'modal.msjERRGEN0001Sugerencia'
                );
            }).finally(() =>
                this.globals.loaderSubscripcion.emit(false)
            );
        } else {
            this.getDialogModal('error', '', '',
                'pantalla.administracion.protocolos.parametros.guardar.VAL001Error',
                'administracion.buzon.msj.codigoCliente'
            );
        }
    }

    onClickConsultar($event?: any) {
        if ($event) {
            this.page = 0;
        }
        if (this.validacionesFormulario() && this.validarFecha()) {
            const fechaIncio = typeof this.datosBuzonRequest.fechaInicio === 'string'
                ? parse(this.datosBuzonRequest.fechaInicio, 'd/MM/yyyy', new Date())
                : this.datosBuzonRequest.fechaInicio;
            const fechaFin = typeof this.datosBuzonRequest.fechaFin === 'string'
                ? parse(this.datosBuzonRequest.fechaFin, 'd/MM/yyyy', new Date())
                : this.datosBuzonRequest.fechaFin;
            
            // Solicitamos el llenado de datos
            var body = this.llenadoDatos(fechaIncio, fechaFin);
            // Llenamos los datos de la consulta
            this.filtros = body;
            this.page = 0;
            this.consQuery(body);
        }
    }


    consQuery(body: any) {
        this.items = [];
        this.banderaTabla = false;
        // Iniciamos la  obtencion de datos
        this.adminBuzonService.consultaAdmonBuzon(body, this.fillObjectPag(this.page, this.rowsPorPagina)).then(resp => {
            if (resp.error === 'OK00000') {
                this.banderaTabla = true;
                this.totalElements = resp.buzones.totalElements;
                this.items = resp.buzones.content;

            } else if (resp.error === 'AB0008') {
                this.getDialogModalAB('error', 'AB0008', 
                    resp.message !== null || resp.message !== "" ? resp.message : 'administracion.buzon.msj.errorFechaInicioAntiguedad'
                );
            } else if (resp.error === 'AB0010') {
                this.getDialogModalAB('error', 'AB0010',
                    resp.message
                );
            } else if (resp.error === 'AB0002') {
                this.getDialogModalAB('info', 'AB0002',
                    'administracion.buzon.error.lista.vacia'
                );
            } else if (resp.error === 'AB0003') {
                this.getDialogModalAB('error', 'AB0003',
                    'administracion.buzon.error.validacion'
                );
            } else if (resp.error === 'AB0009' && resp.message !== null) {
                this.getDialogModalAB('error', 'AB0009',
                    resp.message
                );
            }
        }).catch((e) => {
            this.page = 0;
            console.log(e)
            this.getDialogModal('error',  
                'modal.msjERRGEN0001Titulo', 
                'modal.msjERRGEN0001Observacion',
                'modal.msjERRGEN0001Codigo',
                'modal.msjERRGEN0001Sugerencia'
            );
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }



    /**
    * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
    *
    * @param numPage valor para indicar el numero de la pagina
    * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
    */
    fillObjectPag(numPage: number, totalItemsPage: number) {
        this.objPageable.page = numPage,
        this.objPageable.size = totalItemsPage;
        return this.objPageable;
    }


    exportar() {
        // Solicitamos el llenado de Datos
        const body = this.llenadoDatos(
            new Date(this.datosBuzonRequest.fechaInicio),
            new Date(this.datosBuzonRequest.fechaFin)
        );

        this.adminBuzonService.exportarExcel(body, this.usuarioActual).then(resp => {
            this.fc.convertBase64ToDownloadFileInExport(resp);
        }).catch(() => {
            this.getDialogModal('error',  
                    'modal.msjERRGEN0001Titulo', 
                    'modal.msjERRGEN0001Observacion',
                    'modal.msjERRGEN0001Codigo',
                    'modal.msjERRGEN0001Sugerencia'
                );
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    solicitar(archivo: any) {
        const body = {
            idArchivo: archivo.idArchivo,
            tablaArchivo: archivo.tablaArchivo,
            idResp: archivo.idResp,
            nombreArchivo: archivo.nombreArchivo,
            bandDispWeb: archivo.bandDispWeb
        }

        this.adminBuzonService.solicitarArchivo(body).then(resp => {
            if (resp.codigo === 'OK00000') {
                this.getDialogModal('info', 
                    'buzon.msjINFOOKTitulo', 'administracion.buzon.msj.infoRegistros',
                    'administracion.buzon.msj.code', ''
                );
            }
        }).catch(() => {
            this.page = 0;
            this.getDialogModal('error',  
                    'modal.msjERRGEN0001Titulo', 'modal.msjERRGEN0001Observacion',
                    'modal.msjERRGEN0001Codigo', 'modal.msjERRGEN0001Sugerencia'
                );
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }


    descargaFile(archivo: any) {
        const body = {
            idArchivo: archivo.idArchivo,
            tablaArchivo: archivo.tablaArchivo,
            idResp: archivo.idResp,
            nombreArchivo: archivo.nombreArchivo,
            bandDispWeb: archivo.bandDispWeb
        }

        this.adminBuzonService.descargaArchivo(body).then(resp => {
            let mensaje = resp.message;
            archivo.bandDispWeb = 'I';
            if (resp.code === 'AB0004') {
                mensaje = resp.message;
                this.getDialogModal('info',
                    'buzon.msjINFOOKTitulo', mensaje, 'administracion.buzon.msj.code', ''
                );
            } else {
                this.fc.convertBase64ToDownloadFileInExport(resp);
                this.globals.loaderSubscripcion.emit(false);
            }

        }).catch((err) => {
            console.log(err);
            this.page = 0;
            this.getDialogModal('error',
                'modal.msjERRGEN0001Titulo', 'modal.msjERRGEN0001Observacion',
                'modal.msjERRGEN0001Codigo', 'modal.msjERRGEN0001Sugerencia'
            );
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }


    onPageChanged(event: any) {
        if(event.page !== this.page){
            this.page = event.page -1;
            this.items = [];
    
            this.adminBuzonService.consultaAdmonBuzon(this.filtros, this.fillObjectPag(this.page, this.rowsPorPagina)).then(resp => {
                this.items = resp.buzones.content;
                this.globals.loaderSubscripcion.emit(false);
            });
        }
    }

    async consultaQuery(inicio: boolean) {
        var listItems = {};
        try {
            await this.adminBuzonService.consultaAdmonBuzon(
                this.filtros, {page: this.page, size: this.rowsPorPagina }
            ).then( 
                async(resp: any) => {
                listItems = resp.buzones.content;
                this.totalElements = resp.buzones.totalElements;
            });
            this.showResultQuery( listItems, inicio);
        } catch( error ) {
            console.log('error', error);
        }
        this.globals.loaderSubscripcion.emit(false);
    }

    /**
     * Listado de Cuentas
     */
    showResultQuery(listaCuentas: any, inicio: boolean) {
        this.items = listaCuentas;
        if( inicio) {
          this.page = 0
          this.items = this.items ? this.items.slice(0, this.rowsPorPagina) : [];
        } else {
          this.items = this.items;
        }
      }


    /**
        * @description valida si la fecha Inicial es menor o igual a la vigencia
        * @param vigenciaPeri periodo de vigencia
        * @param fecha es la fecha inicial
        * @return devuelve True si la fecha es menor o igual a la vigencia
    */
    validarFechaMenorIgualPeri(fecha: string, vigenciaPeri: String) {
        var vigencia: number = +vigenciaPeri;
        let hoy = new Date();
        // conseguir la representacion de la fecha en milisegundos
        let milis1 = Date.parse(fecha);
        let milis2 = hoy.getTime();
        // calcular la diferencia en milisengundos
        let diff = milis2 - milis1;
        // calcular la diferencia en dias
        let diffDays = diff / (24 * 60 * 60 * 1000);

        return diffDays < vigencia;
    }


    /**
    * @description Metodo para validar las fechas de inicio y fin
    */
    validarFecha(): boolean {
        const fechaIncio = typeof this.datosBuzonRequest.fechaInicio === 'string'
            ? parse(this.datosBuzonRequest.fechaInicio, 'd/MM/yyyy', new Date())
            : this.datosBuzonRequest.fechaInicio;
        const fechaFin = typeof this.datosBuzonRequest.fechaFin === 'string'
            ? parse(this.datosBuzonRequest.fechaFin, 'd/MM/yyyy', new Date())
            : this.datosBuzonRequest.fechaFin;

        if (fechaFin < fechaIncio) {
            return this.getDialogModal('error',  
                    'modal.error.msjDescargaTitulo', 
                    'administracion.buzon.msj.errorFechaInicioValidacion',
                    'pantalla.administracion.protocolos.parametros.guardar.VAL001Error',
                    ''
                );
        }
        const diferenceDays = differenceInDays(fechaFin, fechaIncio);        if(diferenceDays > 90){
            return this.getDialogModal('error',  
                'modal.error.msjDescargaTitulo', 
                'administracion.buzon.msj.errorFechaInicioAntiguedad',
                'modal.comun.mensaje.campos.tipo.VAL002Codigo',
                ''
            );
        }
        return true;
    }


    /**
    * @description Metodo para validar la antiguedad de la fecha inicial
    */
    validarFechaAntiguedad() {
        let hoy = new Date();
        let dieciseisDias = 1000 * 60 * 60 * 24 * 90;
        let resta = hoy.getTime() - dieciseisDias;
        let fechaAntiguedad = new Date(resta);

        // Validamos la fecha ingresada como Inicio y Fin 
        // ademas que la fecha de inicio no sea mayor a la fecha fin
        if (Date.parse(this.datosBuzonRequest.fechaInicio) < fechaAntiguedad.getTime()) {
            // Llamamos al metodo del Modal
            return this.getDialogModal('error',  
                    'modal.error.msjDescargaTitulo', 
                    'administracion.buzon.msj.errorFechaInicioAntiguedad',
                    'pantalla.administracion.protocolos.parametros.guardar.VAL001Error',
                    ''
                );
        }
        return true;
    }


    /**
     * Metodo para las Validaciones del formulario y enviar mensajes de Alerta
     * 
     * @return boolean
     */
    validacionesFormulario(): boolean {
        // Determinamos el tipo de Codigo que enviaremos.
        var tipo = 'pantalla.administracion.protocolos.parametros.guardar.VAL001Error';
        var opRes = true;
        // Validamos los valores de las variables del Formulario
        if (this.datosBuzonRequest.tipoArchivo == "" || this.datosBuzonRequest.tipoArchivo == undefined) {
            opRes = this.getDialogModal('error', '', '', tipo,
                'administracion.buzon.msj.errorNomArchivo');
            return false;
        } else if (this.datosBuzonRequest.codigoCliente == "" || this.datosBuzonRequest.codigoCliente == undefined) {
            opRes = this.getDialogModal('error', '', '', tipo,
                'administracion.buzon.msj.codigoCliente');
            return false;
        } else if (this.datosBuzonRequest.contrato == "" || this.datosBuzonRequest.contrato == undefined) {
            opRes = this.getDialogModal('error', '', '',  tipo,
                'administracion.buzon.msj.errorContratos');
            return false;
        }
        // Enviamos el valor booleano obtenido en el llamado al Modal = False
        return opRes;
    }


    /**
     * Metodo que permite el llenado de datos en un arreglo JSON
     * 
     * @param fechaIncio 
     * @param fechaFin 
     * @returns 
     */
    llenadoDatos(fechaIncio: any, fechaFin: any) {
        var body = {
            buc: this.datosBuzonRequest.codigoCliente,
            tipoArchivo: this.datosBuzonRequest.tipoArchivo,
            fechaInicio: format(fechaIncio, 'dd/MM/yyyy'),
            fechaFin: format(fechaFin, 'dd/MM/yyyy'),
            perfil: 'PERF_OPC_ADM_H2H_FU_PERS', //TODO: Revisar con Omar despues de subir el cambio
            numContrato: this.datosBuzonRequest.contrato,
            contrato: this.datosBuzonRequest.idContrato
        };

        // Validamos que el campo esta lleno para agregar un campo al array
        if( this.datosBuzonRequest.nombreArchivo !== '') {
            body = Object.assign({}, body, {nombreArchivo : this.datosBuzonRequest.nombreArchivo});
        }

        // Retornamos el arreglo de datos
        return body;
    }

    /**
     * Metodo para la limpieza de las variables que estan relacionadas a los campos del formulario
     */
    onClickLimpiar() {
        this.datosBuzonRequest.nombreArchivo = "";
        this.datosBuzonRequest.tipoArchivo = "";
        this.datosBuzonRequest.contrato = "";
        this.datosBuzonRequest.codigoCliente = "";
        this.datosBuzonRequest.fechaInicio = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
        this.datosBuzonRequest.fechaFin = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
        this.banderaTabla = false;
        this.page = 0;
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

    /**
        * @description evento que se ejecutara para solo permitir valores
        * numericos
    */
    eventOnKeyOnlyNumbers(event: any) {
        this.fc.validateKeyCode(event);
    }

    /**
        * @description Evento del keyPress para validar que el campo solo reciba
        * valores alphanumericos
    */
    eventAlphaNumericOnly(event: KeyboardEvent) {
        this.fc.alphaNumberOnly(event);
    }



    /**
     * Generamos un metodo para el envio de mensajes de Alertas al Front
     * 
     * @params {tpError} Tipo de Error: error, info, warning, alert
     * @params {titulo}  Titulo del Modal
     * @params {observacion} Comentario u observacion en el Modal
     * @params {codigo}  Codigo de Error
     * @params {msgAlert}  Mensaje de Alerta del Modal
     * 
     * @return {boolean} Retorna un False en este tipo de Modal
     */
    getDialogModal(
        tpError: any,
        titulo: string,
        observacion: string,
        codigo: string,
        msgAlert: string) {
        // Validamos si se envia el titulo o colocamos una cadena vacia
        if( titulo!=='' ) {
            titulo = this.translate.instant(titulo);
        }
        // Validamos si se envia el campo de comentarios o colocamos una cadena vacia
        if(observacion !=='') {
            observacion = this.translate.instant(observacion);
        }
        // Validamos si se envia el codigo de error colocamos una cadena vacia
        if(codigo !=='') {
            codigo = this.translate.instant(codigo);
        }
        // Validamos si se envia el mensaje de Alerta o colocamos una cadena vacia
        if( msgAlert !== '') {
            msgAlert = this.translate.instant(msgAlert);
        }
        // Generamos el Dialog Modal
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                titulo,
                observacion,
                tpError,
                codigo,
                msgAlert
            ),
        });
        // Retornamos un valor booleano para el procesamiento de los datos
        return false;
    }


    /**
     * Metodo para el MODAL con parametros de Dialog AB
     */
    getDialogModalAB(
        tpError: any,
        codigo: string,
        msgAlert: string) {
        // Validamos si se envia el mensaje de Alerta o colocamos una cadena vacia
        if( msgAlert !== '') {
            msgAlert = this.translate.instant(msgAlert);
        }
        // Generamos el Dialog Modal
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                '', '', tpError, codigo, msgAlert
            ),
        });
        // Retornamos un valor booleano para el procesamiento de los datos
        return false;
    }
}
