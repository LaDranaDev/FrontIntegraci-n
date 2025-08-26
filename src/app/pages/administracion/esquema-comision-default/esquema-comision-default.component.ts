import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EsquemaComisionDefaultService } from 'src/app/services/administracion/esquema-comision-default.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ValidacionesEsquemaDefault } from './validaciones-esquema-default';
import { EsquemaComisionesService } from 'src/app/services/admin-contratos/esquema-comisiones.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';

interface EsquemaRequest {
    idProductoContrato: '',
    idCriterio: number,
    idRango: number,
    rangos: any,
    idProdCntrPc: '',
    sinLimiteRango: number,
    criterioCom: number
}

@Component({
    selector: 'app-esquema-comision-default',
    templateUrl: './esquema-comision-default.component.html',
    styleUrls: ['./esquema-comision-default.component.css']
})
export class EsquemaComisionDefaultComponent implements OnInit, OnDestroy {
    productoPivote: any;
    idContratoDefault: any;
    usuarioActual: string | null='';

    constructor(
        private comunService: ComunesService,
        private esquemaComisionDefaultService: EsquemaComisionDefaultService,
        private esquemaComisionService: EsquemaComisionesService,
        private dialog: MatDialog,
        private translate: TranslateService,
        private globals: Globals,
        private fc: FuncionesComunesComponent,
        private fb: FormBuilder,
        private validaciones: ValidacionesEsquemaDefault,
        public datePipe: DatePipe,
    ) { 
        this.usuarioActual = localStorage.getItem('UserID');
    }
    SIGNO_PESOS = '$';
    PORCENTAJE = '%';
    SIN_LIMITE = 'Sin Límite';

    formProductos: FormGroup;
    configAnualidad: boolean = false;
    banderaHasRows: boolean = false;
    clickSuscliption: Subscription | undefined;

    // Definen el número de columnas de Rango y Precio
    RANGOS: number = 10;
    RANGOS_ARRAY = new Array(this.RANGOS);

    // Arreglos para llenar las opciones de los combos al cargar la pantalla con el primer servicio
    criterios: { idCatalogo: number, descripcionCatalogo: string }[] = [];
    rangos: { idCatalogo: number, descripcionCatalogo: string }[] = [];

    // Arreglo de objetos para la tabla
    esquemaComisionesArray: any;
    ID_CODIGO_CNTR: string;
    configAnualidadData: any;
    hdnContratoFolio: any;
    datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-red',
        showWeekNumbers: false,
        adaptivePosition: true
    });

    ngOnInit() {
        this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 13) {
                this.banderaHasRows = false;
                this.configAnualidad = false;
                await this.obtenerEsquemaComisionDefault();
            }
        });
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }



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

    limpiarEsquema() {
        const criterio = this.criterios.find((data) => data.descripcionCatalogo.includes('OPERACIÓN($)'));
        this.esquemaComisionesArray.map((item: any) => {
            item.bandSinLimite = 0;
            item.criterioCom = criterio ? criterio.idCatalogo : 0;
            item.rangos = this.limpiarRangos(item.rangos)

        });
    }

    openConfirmYN() {
        const dialogo = this.dialog.open(ModalConfirmacionOkCancelComponent, {
            data: new ModalInfoBeanComponents(this.translate.instant('modals.catalogoDin.confirmacion'), this.translate.instant('esquemaDefault.advertencia'), 'confirm'), hasBackdrop: true
        });
        dialogo.afterClosed().subscribe(result => {
            if (result == 'si') {
                this.guardarEsquema()
            }
        });
    }

     async guardarEsquema() {
        const newArrEsque: { criterioCom: any; idCriterio: any; idProdCntrPc: any; idProductoContrato: any; idRango: any; rangos: any; sinLimiteRango: number; }[] = [];
        try {
            this.esquemaComisionesArray.forEach((item: any, indexEsq: number) => {
                const esquemaMap = {
                    criterioCom: item.criterioCom,
                    idCriterio: item.criterioCom,
                    idProdCntrPc: item.idProdCntrPc,
                    idProductoContrato: item.idProdCntrPc,
                    idRango: item.bandSinLimite,
                    rangos: item.rangos.map((data: any, index: number) => {
                        let newRango = { precio: '', valor: '', posicion: 0 }
                        /* if (flag) {
                            data.precio = '0.0';
                            data.valor =  '0.0';
                        } */
                        if (data.valor == this.SIN_LIMITE) {
                            data.valor = "-1.0";
                        }
                        data.precio = data.precio.replace(this.SIGNO_PESOS, '')
                        data.precio = data.precio.replace(this.PORCENTAJE, '')
                        data.valor = data.valor.replace(this.SIGNO_PESOS, '')
                        data.valor = data.valor.replace(this.PORCENTAJE, '')
                        newRango.precio = data.precio.replace(this.SIGNO_PESOS, '') || data.precio.replace(this.PORCENTAJE, '')
                        newRango.valor = data.valor.replace(this.SIGNO_PESOS, '') || data.valor.replace(this.PORCENTAJE, '')
                        return newRango;
                    }),
                    sinLimiteRango: parseInt(item.bandSinLimite),
                }
                console.log('esquemap', esquemaMap);
                newArrEsque.push(esquemaMap);
            });
            const request = {
                esquema: newArrEsque
            }
            await this.esquemaComisionService.actualizaEsquemaDefault(this.hdnContratoFolio, request);
            await this.obtenerEsquemaComisionDefault();
        }  catch(error) {
            console.log('Ocurrio un error ................');
        }
        this.globals.loaderSubscripcion.emit(false);
    }

    limpiarRangos(listaRangos: any[]) {
        let data: any = []
        listaRangos.map((r, ind) => {
            data = [...data, {
                idRango: null,
                posicion: null,
                precio: null,
                valor: null,
                idCntrEsq: null,
            }]
        });
        return data;
    }

    obtenerRangos(producto: any) {
        const { rangos } = producto;
        return rangos;

    }


    async obtenerEsquemaComisionDefault() {
        const resp = await this.esquemaComisionDefaultService.getEsquemaComisionDefault().catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia'))
            }
            );
            return null;
        });
        this.globals.loaderSubscripcion.emit(false)

        if (!resp) {
            return
        }

        const { dataModel } = resp;
        const s = [
            {
              "idProdCntrPc": 15,
              "idEsqCom": "7758",
              "producto": 8,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "0",
              "descProducto": "Comision H2H",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": true,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "6.0",
                  "valor": "78.0",
                  "idCntrEsq": "7758"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 18,
              "idEsqCom": "7759",
              "producto": 148,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Apor Obrero Patronales IMSS INFONAVIT",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "50000.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7759"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 43,
              "idEsqCom": "7760",
              "producto": 1103,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "CHEQUERA DE SEGURIDAD",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "65.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7760"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 7,
              "idEsqCom": null,
              "producto": 9,
              "criterioCom": 1,
              "sinLimiteRango": null,
              "posicion": null,
              "bandSinLimite": null,
              "descProducto": "Estados de Cuenta",
              "descCriterioCom": null,
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 29648,
              "idEsqCom": "7761",
              "producto": 146,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Impuestos Federales",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "654.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7761"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 20,
              "idEsqCom": "7762",
              "producto": 153,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Impuestos Federales",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "54.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7762"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 42,
              "idEsqCom": "7763",
              "producto": 189,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "NOMINA BANCARIA ONLINE",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "4.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7763"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 3,
              "idEsqCom": "7764",
              "producto": 3,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Nomina Interbancaria",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "654.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7764"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 37,
              "idEsqCom": "7765",
              "producto": 1012,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Nomina Interbancaria ONLINE",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "654.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7765"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 5,
              "idEsqCom": "7766",
              "producto": 5,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Nomina Mismo Banco",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "465.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7766"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 6,
              "idEsqCom": "7767",
              "producto": 7,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "ORDEN DE PAGO",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "8.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7767"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 30,
              "idEsqCom": "7768",
              "producto": 1002,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Pago Directo",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "36541.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7768"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 39,
              "idEsqCom": "7769",
              "producto": 1010,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Pago de Impuestos Aduanales",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "3514.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7769"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 22,
              "idEsqCom": null,
              "producto": 155,
              "criterioCom": 1,
              "sinLimiteRango": null,
              "posicion": null,
              "bandSinLimite": null,
              "descProducto": "Reporte de Cobranza",
              "descCriterioCom": null,
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 25,
              "idEsqCom": "7770",
              "producto": 1000,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "SPID",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "1563.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7770"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 29695,
              "idEsqCom": "7771",
              "producto": 147,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Servicios e Impuestos Locales",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "463.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7771"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 21,
              "idEsqCom": "7772",
              "producto": 154,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Servicios e Impuestos Locales",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "3615.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7772"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 2,
              "idEsqCom": "7773",
              "producto": 2,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "TEF",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "6315.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7773"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 38,
              "idEsqCom": "7774",
              "producto": 1013,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "TEF ONLINE",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "3651.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7774"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 4,
              "idEsqCom": "7775",
              "producto": 4,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "TMB",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "51.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7775"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 41,
              "idEsqCom": "7776",
              "producto": 188,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "TRANSFERENCIAS BANCARIAS ONLINE",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "5136.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7776"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 1,
              "idEsqCom": "7777",
              "producto": 1,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "TRANSFERENCIAS SPEI",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "32.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7777"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 24,
              "idEsqCom": "7778",
              "producto": 158,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencia Internacional Misma Divisa USDUSD",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "365.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7778"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 32,
              "idEsqCom": "7779",
              "producto": 1003,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias Internacionales Cambiarias",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "1.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7779"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 19,
              "idEsqCom": "7780",
              "producto": 25,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias Internacionales Misma Divisa USDUSD",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "13.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7780"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 44,
              "idEsqCom": "7781",
              "producto": 26,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias Mismo Banco Cambiarias MXP-USD",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "32.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7781"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 40,
              "idEsqCom": "7782",
              "producto": 1011,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias SPEI ONLINE",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "321.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7782"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 33,
              "idEsqCom": "7783",
              "producto": 1004,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias Vostro Interbancarias",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "132.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7783"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            },
            {
              "idProdCntrPc": 31,
              "idEsqCom": "7784",
              "producto": 1006,
              "criterioCom": 1,
              "sinLimiteRango": 0,
              "posicion": null,
              "bandSinLimite": "1",
              "descProducto": "Transferencias Vostro Mismo Banco",
              "descCriterioCom": "OPERACIÓN($)",
              "esComisionH2H": false,
              "rangos": [
                {
                  "idRango": null,
                  "posicion": "0",
                  "precio": "21.0",
                  "valor": "-1.0",
                  "idCntrEsq": "7784"
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                },
                {
                  "idRango": null,
                  "posicion": null,
                  "precio": null,
                  "valor": null,
                  "idCntrEsq": null
                }
              ]
            }
          ]
        const { msj = '', esquema = s, listaCritCom = [], listaSinLimite = [], productoPivote, idContrato = 7, ID_CODIGO_CNTR, hdnContratoFolio } = dataModel;
        if (msj === 'INF002') {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('esquemaComisiones.msjINF002Titulo'),
                    this.translate.instant('esquemaComisiones.msjINF002Observacion'),
                    'info',
                    this.translate.instant('esquemaComisiones.msjINF002Codigo'),
                    this.translate.instant('esquemaComisiones.msjINF002Sugerencia')
                ),
            })
        } else {
            if (esquema.length > 0) {
                this.productoPivote = parseInt(productoPivote);
                this.banderaHasRows = true;
                this.criterios = listaCritCom;
                this.rangos = listaSinLimite;
                this.esquemaComisionesArray = s;
                this.RANGOS_ARRAY = new Array(listaSinLimite.length - 1);
                this.idContratoDefault = idContrato;
                this.ID_CODIGO_CNTR = ID_CODIGO_CNTR;
                this.hdnContratoFolio = hdnContratoFolio
                await this.habilitarCamposColumnasAlCargar();

            }
        }

    }

    async activarConfiguracion(isFromUpdate?: boolean) {
        this.configAnualidad = isFromUpdate? this.configAnualidad: !this.configAnualidad

        const resp = await this.esquemaComisionService.obtenerConfiguracionAnual(this.idContratoDefault).catch((e) => {
            return null;
        });

        this.globals.loaderSubscripcion.emit(false)

        if (!resp) {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
            return;
        }
        const { configuraciones } = resp;
        this.configAnualidadData = configuraciones ? configuraciones : [];
        return;

    }


    abrirModalExportar(configAnual?: boolean) {
        this.dialog.open(ModalExportacionComponent, { hasBackdrop: true }).afterClosed().subscribe((formato) => {
            if (formato) {
                if (configAnual) {
                    this.exportarConfAnual(formato)
                } else {
                    this.exportar(formato);
                }
            }
        });
    }

    verificarInputActivo(index: number, bandSinLimite: any, value?: string, prodductoId?: number): boolean {
        /* if(value === 'Sin Límite'){
            return true
        } */
        //Validación que funciona solamente para que cuando bandSinLimite en el producto 8 habilite únicamente los dos primeros
        const fV = this.esquemaComisionesArray[0];
        if (fV.bandSinLimite == 0 && index === 0 && prodductoId == 8) {
            return false;
        }
        if (index < parseInt(bandSinLimite)) {
            return false;
        } else {
            return true
        }
    }

    actualizarInput(producto: any, e: any) {
        const limit = e.value;
        const firstLimit = this.esquemaComisionesArray[0];
        if (producto.producto === this.productoPivote || firstLimit.bandSinLimite == 0) {
            producto.bandSinLimite = `${limit}`;
            var selLimite: any = document.getElementById(`limite${producto.idProdCntrPc}`);
            selLimite.value = limit;
        } else {
            producto.bandSinLimite = 0;
            var selLimite: any = document.getElementById(`limite${producto.idProdCntrPc}`);
            selLimite.value = 0;
        }

        producto.rangos.map((data: any) => {
            if (limit == 0) {
                data.idRango = '';
                data.posicion = '';
                data.precio = '';
                data.valor = '';
                data.idCntrEsq = '';
            }
        });
        if (producto.producto === 8) {
            //cambiar el esquema a bandSinLimite = 0
            this.esquemaChangePosition('0', true);
        }
    }

    esquemaChangePosition(pos: string, isFronCombo?: boolean): void {
        this.esquemaComisionesArray.forEach((k: {
            rangos: any; bandSinLimite: string;
        }, ind: number) => {
            if ((ind !== 0 && Number(k.bandSinLimite) <= 0) || (ind !== 0 && isFronCombo)) {
                k.bandSinLimite = pos
                k.rangos.map((data: any, indx: number) => {
                    data.idRango = '';
                    data.posicion = '';
                    data.precio = '';
                    data.valor = indx === 0 && pos === '1' ? this.SIN_LIMITE : '';
                    data.idCntrEsq = '';
                });
            }else{
            }
        });
        console.log('entó', this.esquemaComisionesArray);
    }
    habilitaRangos(producto: any, rango: any, prodbase: any, inicio: any, productData?: any) {
        var valorlimite = -1;

        if (prodbase === this.productoPivote) {
            valorlimite = this.productoPivote;
        }

        /* if (valorlimite > 0 && (inicio !== '1')) {
            console.log('entra');
            productData.bandSinLimite = 0;
            return;
        } */

        if (rango !== '') {
            // primero obtenemos valores de columnas y deshabilitamos
            //rango == 0 && prodbase == 8 ? '0' valida el rango para poder habilitar el primer rango si se selecciona la posición 0

            productData.rangos.map((data: any, index: number) => {
                if(index === 0 && rango == 0 && prodbase == 8){
                    const isMoreThan0 = data.valor > 0;
                    if(!isMoreThan0){
                        data.valor = '0'
                        data.precio = '0'
                    }
                }else{
                    data.valor = this.validaRangos("criterio", producto, rango, index, productData, data.valor, data.precio);
                    data.precio = this.validaRangos("limite", producto, rango, index, productData, data.valor, data.precio);
                }
            });

            if (prodbase === this.productoPivote) {
                if (prodbase !== this.productoPivote) {
                    productData.rangos.map((data: any, index: number) => {
                        data.valor = this.validaRangos('criterio', prodbase, '0', index, productData, data.valor, data.precio);
                        data.precio = this.validaRangos('limite', prodbase, '0', index, productData, data.valor, data.precio);
                    });
                }
                if (prodbase !== this.productoPivote) {
                    producto.bandSinLimite = 0;
                }
            }
        } else {
            productData.rangos.map((data: any, index: number) => {
                data.valor = this.deshabilitaR("criterio", prodbase, inicio, index, productData, data.valor, data.precio);
                data.precio = this.deshabilitaR("limite", prodbase, inicio, index, productData, data.valor, data.precio);
            });

        }
    }

    validaRangos(campos: string, idProdCntrPc: number, rango: string, index: number, productData: any, valor?: any, precio?: any): any {
        const rangoNumber = parseInt(rango) - 1;
        if (index <= rangoNumber) {

            if (index === rangoNumber
                && campos.indexOf('criterio') === 0) {
                return this.SIN_LIMITE;
            } else {
                if (valor === this.SIN_LIMITE
                    && campos.indexOf('criterio') === 0) {
                    return '';
                } else {
                    return precio;
                }
            }
        } else {
            return '';
        }

    }

    deshabilitaR(campos: string, idProdCntrPc: number, rango: string, index: number, productData: any, valor?: any, precio?: any): any {
        const rangoNumber = parseInt(rango) - 1;
        let unSoloLimite = 0;

        if (idProdCntrPc === this.productoPivote) {
            if (unSoloLimite === 0) {// lo dejamos en el primer limite cuando esl
                // el pivote

                if (index === 1) {
                    // $(this).val('');
                } else {
                    return '0';
                }
                unSoloLimite++;

            } else {
                return '';
            }
        } else {
            return '';
        }

        if (index <= rangoNumber) {

            if (index === rangoNumber
                && campos.indexOf('criterio') === 0) {
                return this.SIN_LIMITE;
            } else {
                if (valor === this.SIN_LIMITE
                    && campos.indexOf('criterio') === 0) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }


    exportar(formato: string) {
        var body = {
            formato: formato,
            hdnContratoFolio: this.hdnContratoFolio,
            usuario: this.usuarioActual
        }
        this.esquemaComisionDefaultService.exportarArchivo(body).then((result: any) => {
            if (result.data) {
                /** Se manda la informacion para realizar la descarga del archivo */
                this.fc.convertBase64ToDownloadFileInExport(result);
                this.globals.loaderSubscripcion.emit(false);
            } else {
                if (result.code === '404') {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents('Error', result.message, 'error', ''),
                        hasBackdrop: true
                    });
                } else {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents('Error', this.translate.instant('modals.error.pdf'), 'error', ''),
                        hasBackdrop: true
                    });
                }
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
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    verificarPivote(e: any, index: number, idProdCntrPc: string, prodbase: string, valorRngo: number, bandSinLim?: string, valorPrecio?: any) {
        const valor = `valor.${idProdCntrPc}.${index}`;  
        console.log('value', e.target.value);     
        if (e.target.value != this.SIN_LIMITE) {
            if (prodbase == this.productoPivote) {
                this.validaciones.esDatoValidoPivote(e.target.value, index, idProdCntrPc, valorRngo, bandSinLim as string);
                if (prodbase == '8' && index == 0 && bandSinLim == '0' && valorRngo > 0 && e.target.value > 0) {
                    this.esquemaChangePosition('1');
                    }
                } else {
                this.validaciones.esDatoValidoSinLimite(e.target.value, index, idProdCntrPc, valor);
            }
        }

    }

    PosEnd(e: any) {
        let name: any = document.getElementById(e.target.id);
        if (e.target.value == this.SIN_LIMITE) {
            name.focus();
            name.setSelectionRange(name.value.length, name.value.length);
        }

    }

    limpiarConfAnual() {
        this.configAnualidadData.map((item: any) => {
            item.monto = '';
            item.fecha = '';
            item.fechaFPA = '';
            item.estatus = 'I';
        })
    }

    async guardarConfAnual(): Promise<void> {
        const askModal = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('config.cobranza.guardarAnualidad'),
                '',
                'confirm',
                '',
                ''
            ),
        });
        askModal.afterClosed().subscribe((async r =>{
            if(r === 'si' || r === 'ok'){
                try {
                    const r = await this.esquemaComisionService.guardarConfiguracionAnual(this.configAnualidadData, this.idContratoDefault);
                    if(r.codigoError === 'OKACTAC') {
                        this.dialog.open(ModalInfoComponent, {
                            data: new ModalInfoBeanComponents(
                                this.translate.instant('esquemaComisiones.modal.msjINF001Titulo'),
                                '',
                                'info',
                                this.translate.instant('config.cobranza.msjOKACTACCodigo'),
                                this.translate.instant('config.cobranza.msjOKACTACObservacion'),
                            ),
                        });
                        this.activarConfiguracion(true);
                    } else{
                        this.showMsgErrorAnualidad();
                    }
                    this.globals.loaderSubscripcion.emit(false);            
                } catch (error) {
                    this.showMsgErrorAnualidad();
                    this.globals.loaderSubscripcion.emit(false);
                }
            }
        }))
    }

    showMsgErrorAnualidad(): void{
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                '',
                'error',
                this.translate.instant('config.cobranza.msjERRDBCA02Codigo'),
                this.translate.instant('config.cobranza.msjERRDBCA02Observacion')
            ),
        });
    }
    activarEstatusConfAnual(e: any, configAnualidad: any) {
        configAnualidad.estatus = e.target.checked ? 'A' : 'I';
    }

    exportarConfAnual(formato: string) {
        var body = {
            formato: formato,
            hdnContratoFolio: this.idContratoDefault,
            usuario: this.usuarioActual
        }
        this.esquemaComisionService.obtieneReporteConfigAnual(body).then((result: any) => {
            if (result.data) {
                /** Se manda la informacion para realizar la descarga del archivo */
                this.fc.convertBase64ToDownloadFileInExport(result);
                this.globals.loaderSubscripcion.emit(false);
            } else {
                if (result.code === '404') {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents('Error', result.message, 'error', ''),
                        hasBackdrop: true
                    });
                } else {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents('Error', this.translate.instant('modals.error.pdf'), 'error', ''),
                        hasBackdrop: true
                    });
                }
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
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    habilitarCamposColumnasAlCargar() {
        this.esquemaComisionesArray.map((item: any, indexEsq: number) => {
            try {
                this.habilitaRangos(item.idProdCntrPc, item.bandSinLimite, item.producto, 1, item);
                this.cambiaCriterios(item)
                if (item.criterioCom === 1 || item.criterioCom === 2) {
                    this.agregarSignoPesos(item);
                }
                item.rangos.map((data: any, index: number) => {
                    /* const flag = this.verificarInputActivo(index, item.bandSinLimite)
                    if (flag) {
                        data.idRango = '';
                        data.posicion = '';
                        data.precio = '';
                        data.valor = '';
                        data.idCntrEsq = '';
                    } */
                });
                item.posicion = "";
            } catch (error) {
                console.log(error);

            }

        });
    }

    agregarSignoPesos(productData: any) {
        const { criterioCom } = productData;
        productData.rangos.map((data: any, index: number) => {
            const { precio } = data;
            if (precio !== '') {
                if (precio?.indexOf(this.SIGNO_PESOS) > -1) {
                    // nada ya existe
                } else {
                    // se agrega
                    if (isNaN(precio)) {
                        if (precio !== this.SIN_LIMITE) {
                            data.precio = '';
                        }
                    } else {
                        if (criterioCom === 1 || criterioCom === 3) {//Operacion
                            data.precio = this.SIGNO_PESOS + this.formateaNumero(precio, 0);
                        } else {
                            data.precio = this.SIGNO_PESOS + this.formateaNumero(precio, 2);
                        }
                    }
                }
            }
        })
    }

    cambiaCriterios(productData: any) {
        productData.bandSinLimite ? productData.bandSinLimite : productData.bandSinLimite = '0'
        let { criterioCom, bandSinLimite } = productData;
        bandSinLimite == null ? bandSinLimite = '1' : bandSinLimite
        productData.rangos.map((data: any, index: number) => {
            let { valor, precio } = data;

            if (index >= parseInt(bandSinLimite)) {
                return;
            }

            precio = precio.replace(this.SIGNO_PESOS, '');
            precio = precio.replace(this.PORCENTAJE, '');

            if (valor != this.SIN_LIMITE && valor !== '') {
                if (criterioCom == '2' || criterioCom == '4') {// Monto y Monto %
                    if (valor.indexOf(this.SIGNO_PESOS) > -1) {
                        data.valor = valor.replace(this.SIGNO_PESOS, '');
                    }
                    if (!isNaN(valor)) {
                        data.valor = this.SIGNO_PESOS + '' + this.formateaNumero(valor, 2);
                    } else {
                        data.valor = '';
                    }
                } else if (criterioCom == '1' || criterioCom == '3') {// Operacion y Operacion %
                    data.valor = this.formateaNumero(valor, 0);
                }
            }

            if (criterioCom == '3') {// Operacion %
                data.precio = this.formatoPorcentaje(precio);
            } else if (criterioCom == '4') {// Monto %
                data.precio = this.formatoPorcentaje(precio);
            } else {
                data.precio = this.eliminaPorcentaje(precio);
                if (precio.indexOf(this.SIGNO_PESOS) > -1) {
                    data.precio = precio.replace(this.SIGNO_PESOS, '');
                } else if (precio.indexOf(this.PORCENTAJE) > -1) {
                    data.precio = precio.replace(this.PORCENTAJE, '');
                }
                data.precio = this.formateaNumero(precio, 2);
                if (precio !== '') {
                    data.precio = this.SIGNO_PESOS + precio;
                }
            }
        })


    }

    formateaNumero(campo: any, decimales: number) {

        if (campo !== '') {
            if (campo?.indexOf(this.SIGNO_PESOS) > -1) {
                campo = campo.replace(this.SIGNO_PESOS, '');
            }
            var valorInt = '';
            if (!isNaN(campo)) {
                valorInt = parseFloat(campo).toFixed(decimales);
                campo = valorInt;
            } else {
                campo = "0.00";
            }

        } else {
            campo = "0.00";
        }
        return campo;
    }

    eliminaPorcentaje(valor: string) {
        var tempvalor = '';
        if (valor !== '') {
            if (valor.indexOf(this.PORCENTAJE) > -1) {
                tempvalor = valor.replace(this.PORCENTAJE, '');
            } else {
                if (valor.indexOf(this.SIGNO_PESOS) > -1) {
                    tempvalor = valor.replace(this.SIGNO_PESOS, '');
                } else {
                    tempvalor = valor;
                }
                if (!isNaN(parseFloat(tempvalor))) {
                    tempvalor = this.SIGNO_PESOS + this.formateaNumero(tempvalor, 2);
                } else {
                    tempvalor = this.SIGNO_PESOS + '0.00';
                }
            }
        }
        return tempvalor;
    }

    formatoPorcentaje(valor: string) {
        var tempvalor = '';
        if (valor !== '') {
            if (valor.indexOf(this.SIGNO_PESOS) > -1) {
                tempvalor = valor.replace(this.SIGNO_PESOS, '');
            } else if (valor.indexOf(this.PORCENTAJE) > -1) {
                tempvalor = valor.replace(this.PORCENTAJE, '');
            } else {
                tempvalor = valor;
            }
            if (isNaN(parseFloat(tempvalor))) {
                tempvalor = '0' + this.PORCENTAJE;
            } else {
                if (parseFloat(tempvalor) >= 0 && parseFloat(tempvalor) < 100) {
                    tempvalor = parseFloat(tempvalor).toFixed(2) + this.PORCENTAJE;
                } else {
                    tempvalor = '100' + this.PORCENTAJE;
                }
            }
        }
        return tempvalor;
    }

    validarOperacion(e: any, rango: any, criterio: any) {
        const value = e.target.value
        if (value !== '') {
            if (isNaN(value)) {
                rango.valor = value;
            } else {

                if (criterio === 1 || criterio === 3) {//Operacion
                    rango.valor = this.formateaNumero(value, 0)

                } else {
                    rango.valor = this.SIGNO_PESOS + this.formateaNumero(value, 2)
                }
            }
        }

    }


    changeValueInput(index: number, idProdCntrPc: string){
        const inputRango: any = document.getElementById(`rango${idProdCntrPc}${index}`);
        inputRango.value = (inputRango.value as string).replace('$', '');
    }

    habilitarbyProdPiv(product: any, range: any): void{
        /* if(product.producto == this.productoPivote && product.bandSinLimite == 0){
            const verifyValuesProducts = (this.esquemaComisionesArray as any[]).filter((y) => y.bandSinLimite > 0);
            //this.esquemaChangePosition('1');
            console.log('verifyValuesProducts', verifyValuesProducts);
            console.log('producto', product);
            console.log('range', range);
        } */
    }
}
