import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { BitacoraEnvioEstadoCuentaService } from 'src/app/services/consultas-reportes/bitacora-envio-estado-cuenta.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { format } from 'date-fns';

@Component({
    selector: 'app-bitacora-envio-estado-cuenta',
    templateUrl: './bitacora-envio-estado-cuenta.component.html',
    styleUrls: ['./bitacora-envio-estado-cuenta.component.css']
})
export class BitacoraEnvioEstadoCuentaComponent implements OnInit {
    tiposEdoCuenta: { idTipoEstadoCuenta: number, descTipoEstadoCuenta: string }[] = [];
    clickSuscliption: Subscription | undefined;
    formBitaEdoCuenta: FormGroup;
    bitacora: any[] = [];
    page: number = 1;
    PAGE_SIZE: number = 20;
    totalElements: number = 0;
    datePickerConfig: Partial<BsDatepickerConfig> = {
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-red',
        showWeekNumbers: false,
        isDisabled: true,
        adaptivePosition: true
    };
    constructor(
        private fc: FuncionesComunesComponent,
        private fb: FormBuilder,
        private comunService: ComunesService,
        private bitacoraEnvioEstadoCuentaService: BitacoraEnvioEstadoCuentaService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private globals: Globals,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 4) {
                this.clearForm();
                if (this.tiposEdoCuenta.length === 0) {
                    this.getEdoCuentaTypes();
                }
            }
        });
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    createForm(): void {
        this.formBitaEdoCuenta = this.fb.group({
            codCliente: [''],
            numCuenta: [''],
            numContrato: [''],
            estatusContrato: [{ value: '', disabled: true }],
            razonSocial: [{ value: '', disabled: true }],
            tipoEdoCuenta: [this.tiposEdoCuenta.length > 0 ? this.tiposEdoCuenta[1].idTipoEstadoCuenta : ''],
            from: [new Date()],
            to: [new Date()],
        });
    }


    getTableEdosCuenta($event?: any): void {
        this.page = 1;
        if (!this.validateIsValidRangeDate()
            || this.validateFromDateSeventDays()
            || this.validateFromDateNinetyDays() ) return;

        // Limpiamos los datos de Bitacora cuando se inicia una consulta
        this.bitacora = [];
        this.consulWs();
        
        this.globals.loaderSubscripcion.emit(false);
    }


    consulWs() {
        const body = {
            buc: this.formBitaEdoCuenta.get('codCliente')?.value,
            cuenta: this.formBitaEdoCuenta.get('numCuenta')?.value,
            numContrato: this.formBitaEdoCuenta.get('numContrato')?.value,
            idTipoEstadoCuenta: +this.formBitaEdoCuenta.get('tipoEdoCuenta')?.value,
            tipoEstadoCuenta: this.tiposEdoCuenta.find(item => item.idTipoEstadoCuenta === +this.formBitaEdoCuenta.get('tipoEdoCuenta')?.value)?.descTipoEstadoCuenta,
            fechaIni: format(new Date(this.formBitaEdoCuenta.get('from')?.value), 'yyyy-MM-dd'),
            fechaFin: format(new Date(this.formBitaEdoCuenta.get('to')?.value), 'yyyy-MM-dd'),
            numPagina: this.page,
            tamPagina: this.PAGE_SIZE
        }
        this.bitacoraEnvioEstadoCuentaService.getBitacoraEdoCuenta(body).then(resp => {
            // Validamos si se contienen datos 
            if(resp.response.bitacora === null
                && resp.response.bitacoraEdoCta === null
                && resp.responseCode === "OK00000") {
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.titulo'),
                        '',
                        'info',
                        '',
                        this.translate.instant(resp.responseMessage),
                    ),
                });
            } else  if (resp.response.bitacoraEdoCta.length > 0) {
                this.formBitaEdoCuenta.get('estatusContrato')?.setValue(resp.response.datosCliente ? resp.response.datosCliente.estatusContrato : '')
                this.formBitaEdoCuenta.get('razonSocial')?.setValue(resp.response.datosCliente ? resp.response.datosCliente.razonSocial : '')
                // Remplazamos los datos del Array
                this.bitacora = resp.response.bitacoraEdoCta;
                this.totalElements = resp.response.totalRegistros;
            } else {
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.titulo'),
                        '',
                        'info',
                        '',
                        this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.observacion'),
                    ),
                });
            }
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false)
        });
    }

    getEdoCuentaTypes() {
        this.bitacoraEnvioEstadoCuentaService.getTipoEdoCuenta().then(resp => {
            if (resp.responseCode === 'OK00000') {
                this.tiposEdoCuenta = resp.response;
                this.formBitaEdoCuenta.get('tipoEdoCuenta')?.setValue(this.tiposEdoCuenta[1].idTipoEstadoCuenta);
            }
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false)
        });
    }

    export(): void {
        const body = {
            buc: this.formBitaEdoCuenta.get('codCliente')?.value,
            cuenta: this.formBitaEdoCuenta.get('numCuenta')?.value,
            numContrato: this.formBitaEdoCuenta.get('numContrato')?.value,
            fechaIni: format(new Date(this.formBitaEdoCuenta.get('from')?.value), 'yyyy-MM-dd'),
            fechaFin: format(new Date(this.formBitaEdoCuenta.get('to')?.value), 'yyyy-MM-dd'),
            idTipoEstadoCuenta: +this.formBitaEdoCuenta.get('tipoEdoCuenta')?.value,
            tipoEstadoCuenta: this.tiposEdoCuenta.find(item => item.idTipoEstadoCuenta === +this.formBitaEdoCuenta.get('tipoEdoCuenta')?.value)?.descTipoEstadoCuenta,
            numPagina: this.page,
            tamPagina: this.PAGE_SIZE,
            usuario: localStorage.getItem('UserID')
        }

        this.bitacoraEnvioEstadoCuentaService.getZIP(body).then(resp => {
            if (resp.response) {
                const file = {
                    data: resp.response.reporte,
                    type: resp.response.extension,
                    name: resp.response.nombre
                }
                /** Se manda la informacion para realizar la descarga del archivo */
                this.fc.convertBase64ToDownloadFileInExport(file);
            }
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
        this.globals.loaderSubscripcion.emit(false);
    }


    /**
     * Metodo para validar las fechas ingresadas a Siete dias
     * 
     * @returns {boolean} Valor True / False
     */
    validateFromDateSeventDays(): boolean {
        // Dias * Horas Dia * Minutos * Segundos * MiliSegundos = Dias
        const SEVENT_DAYS = 7 * 24 * 60 * 60 * 1000; // 90 días en milisegundos
        const fromDate = new Date(this.formBitaEdoCuenta.get('from')?.value);
        //const todayDate = new Date();
        const todayDate = new Date(this.formBitaEdoCuenta.get('to')?.value);

        //const limitDate = new Date(rango - SEVENT_DAYS);
        // Realizamos la operacion de validacion de Dias
        const isNinetyDays = SEVENT_DAYS <= (todayDate.getTime() - fromDate.getTime())
        
        // Validamos si el valor es Verdadero enviamos un mensaje de error
        if (isNinetyDays) {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.titulo'),
                    '',
                    'info',
                    '',
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.fecha.sieteDias'),
                ),
            });
        }

        return isNinetyDays;
    }


    /**
     * Metodo para la validacion de 90 dias
     * 
     * @returns {boolean}
     */
    validateFromDateNinetyDays(): boolean {
        // Dias * Horas Dia * Minutos * Segundos * MiliSegundos = Dias
        const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000; // 90 días en milisegundos
        const fromDate = new Date(this.formBitaEdoCuenta.get('from')?.value);
        const todayDate = new Date();
        // Realizamos la operacion de validacion de Dias
        //const isNinetyDays = fromDate <= limitDate
        const isNinetyDays = NINETY_DAYS <= (todayDate.getTime() - fromDate.getTime())
        
        // Validamos si el valor es Verdadero enviamos un mensaje de error
        if (isNinetyDays) {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.titulo'),
                    '',
                    'info',
                    '',
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.fecha.noventaDias'),
                ),
            });
        }

        return isNinetyDays;
    }


    /**
     * Metodo para vlaidar que las fechas esten correctas
     * 
     * @returns boolean
     */
    validateIsValidRangeDate(): boolean {
        const fromDate = new Date(this.formBitaEdoCuenta.get('from')?.value);
        const toDate = new Date(this.formBitaEdoCuenta.get('to')?.value);
        const isValidRangeDate = toDate >= fromDate;

        if (!isValidRangeDate) {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.vacia.titulo'),
                    '',
                    'info',
                    '',
                    this.translate.instant('traking.bitacora.envio.estado.cuenta.bitacora.fecha.mayor'),
                ),
            });
        }

        return isValidRangeDate;
    }

    onPageChanged(event: any) {
        this.page = event.page;
        this.consulWs();
    }

    async clearForm() {
        this.createForm();
        this.bitacora = [];
    }

    validateOnlyNumeros(event: KeyboardEvent) {
        this.fc.numberOnly(event);
    }

    validateTamanoBuc(event: any) {
        let buc = event.target.value;
        let tamanio = buc.length;
        let relleno = 8 - tamanio;
        this.formBitaEdoCuenta.get('codCliente')?.setValue(tamanio > 0 ? new Array(relleno + 1).join('0') + buc : buc);
    }

    pasteOnlyNumeros(event: ClipboardEvent) {
        let textPasted = event.clipboardData?.getData('text') || '';
        let flag = true;
        for (let element of textPasted) {
            if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
                flag = false;
            }
        }
        return flag;
    }
}