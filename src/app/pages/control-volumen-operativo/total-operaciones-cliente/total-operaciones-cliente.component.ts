import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { TotalOperacionesClienteService } from 'src/app/services/control-volumen-operativo/total-operaciones-cliente.service';

@Component({
    selector: 'app-total-operaciones-cliente',
    templateUrl: './total-operaciones-cliente.component.html',
    styleUrls: ['./total-operaciones-cliente.component.css']
})
export class TotalOperacionesClienteComponent implements OnInit {
    form: FormGroup;
    tabla: any[] = [];
    clickSuscliption: Subscription | undefined;
    chart: Chart;
    x: number;
    constructor(private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translate: TranslateService,
        private serviceComun: ComunesService,
        private totalOperacionesService: TotalOperacionesClienteService,
        private globals: Globals,
        private fc: FuncionesComunesComponent
    ) { }

    /**
        * @description En caso de cambiar el idioma, se recarga la gráfica para poder cambiar las etiquetas,
        * Se detecta la opción del menú para regresar a la pantalla inicial        
    */
    ngOnInit(): void {
        this.translate.onLangChange.subscribe((params: LangChangeEvent) => {
            this.crearGrafica(this.tabla)
        });

        this.clickSuscliption = this.serviceComun.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 6) this.limpiarFormulario();
        });
    }

    ngAfterViewInit() {
        this.chart = new Chart('chartTotalOperacionesCliente', {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [],
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'blue',
                        fontSize: 2,
                        fontFamily: "'Helvetica Neue'"
                    }
                }
            }
        })
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    iniciarFormulario() {
        this.form = this.formBuilder.group({
            radiobutton: ['', [Validators.required]],
        });
    }

    /**
        * @description Se reinicia el formulario de busqueda        
    */
    limpiarFormulario() {
        this.iniciarFormulario();
        this.tabla = [];
    }

    /**
        * @description Busqueda de Total de operaciones del cliene
    */
    buscarOperaciones() {
        if (this.form.get('radiobutton')?.value) {
            const body = {
                'idProducto': this.form.get('radiobutton')?.value === 'operations' ? 'operaciones' : 'montos',
                'descripcionEstatus': 'Todos'
            }

            this.totalOperacionesService.obtenerOperacionesCliente(body).then((resp => {
                this.tabla = resp.clientes;
                this.globals.loaderSubscripcion.emit(false);
                this.crearGrafica(resp.clientes);
            })).catch(() => {
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
        } else {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
                    this.translate.instant('pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'),
                    'alert',
                ),
            });
        }
    }

    /**
        * @description Generación de gráfica dependiendo de la opción seleccionada
        * @param dataToShow Objeto que contiene la información de los clientes        
    */
    val = 0
    crearGrafica(dataToShow: { nombreCliente: string; numMont: number, numOpr: number }[]): void {
        this.val = 0
        const titleGraph = this.form.get('radiobutton')?.value === 'operations' ?
            this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.totalOperaciones") :
            this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.totalMontos");

        const labesl = dataToShow.map((l) => l.nombreCliente );
        const totalData = dataToShow.map((ta) => this.form.get('radiobutton')?.value === 'operations' ? ta.numOpr : ta.numMont);

        this.validarGrafica();

        if (this.form.get('radiobutton')?.value === 'operations') {
            for (let i of dataToShow) {
                if (this.val < i.numOpr) {
                    this.val = i.numOpr
                }
            }
        } else {
            for (let i of dataToShow) {
                if (this.val < i.numMont) {
                    this.val = i.numMont
                }
            }
        }

        if (this.val < 100) {
            this.x = 10
        }
        if (this.val > 100 && this.val < 1000) {
            this.x = 100
        }
        if (this.val > 1000 && this.val < 10000) {
            this.x = 1000
        }
        if (this.val > 10000 && this.val < 20000) {
            this.x = 2500
        }
        if (this.val > 20000 && this.val < 50000) {
            this.x = 5000
        }
        if (this.val > 50000 && this.val < 100000) {
            this.x = 10000
        }
        if (this.val > 100000 && this.val < 500000) {
            this.x = 100000
        }
        if (this.val > 500000 && this.val < 1000000) {
            this.x = 100000
        }
        if (this.val > 1000000 && this.val < 10000000) {
            this.x = 1000000
        }
        if (this.val > 10000000 && this.val < 100000000) {
            this.x = 10000000
        }
        if (this.val > 100000000 && this.val < 1000000000) {
            this.x = 100000000
        }
        if (this.val > 1000000000 && this.val < 10000000000) {
            this.x = 1000000000
        }
        if (this.val > 10000000000 && this.val < 100000000000) {
            this.x = 10000000000
        }
        if (this.val > 100000000000 && this.val < 1000000000000) {
            this.x = 100000000000
        }
        if (this.val > 1000000000000 && this.val < 10000000000000) {
            this.x = 1000000000000
        }
        if (this.val > 10000000000000 && this.val < 100000000000000) {
            this.x = 10000000000000
        }
        if (this.val > 100000000000000 && this.val < 1000000000000000) {
            this.x = 100000000000000
        }
        Chart.defaults.global.defaultFontSize = 9;
        this.chart = new Chart('chartTotalOperacionesCliente', {
            type: 'horizontalBar',
            options: {
                responsive: true,
                aspectRatio: 2.5,
                scales: {
                    xAxes: [{
                        position: 'top',
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            stepSize: this.x,
                        },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            fontSize: 6
                        },
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            min: 0
                        }
                    }]
                },
                legend: {
                    position: 'bottom',
                    onClick: (e) => e.stopPropagation(),
                },
                title: {
                    display: true,
                    text: titleGraph,
                },
            },
            data: {
                labels: labesl,
                datasets: [
                    {
                        label: this.form.get('radiobutton')?.value === 'operations' ?
                            this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.operaciones") :
                            this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.monto"),
                        data: totalData,
                        borderColor: '#FF7A96',
                        type: 'horizontalBar',
                        fill: false,
                        backgroundColor: '#EAC3CC',
                        borderWidth: 1,
                        weight: 9,
                    },
                ],
            },
        });
        console.log('labels', labesl);
        this.chart.update();
    }

    /**
        * @description Se valida que la gráfica exista o no para destruirla
    */
    validarGrafica() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    /**
        * @description Llamada al servicio para obtener los datos, generar y descargar el XLS
    */
    exportarExcel() {
        if (this.form.get('radiobutton')?.value) {
            const body = {
                'idProducto': this.form.get('radiobutton')?.value === 'operations' ? 'operaciones' : 'montos',
                'descripcionEstatus': 'Todos',
            }

            this.totalOperacionesService.obtenerExcel(body).then((resp => {
                this.fc.convertBase64ToDownloadFileInExport(resp);
                this.globals.loaderSubscripcion.emit(false);
            })).catch(() => {
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
        }
    }
}
