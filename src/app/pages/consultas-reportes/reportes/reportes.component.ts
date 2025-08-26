import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { differenceInDays, format } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ReportesService } from 'src/app/services/consultas-reportes/reportes.service';

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
    calendario = false;
    datePickerConfig: Partial<BsDatepickerConfig> = {
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-red',
        showWeekNumbers: false,
        isDisabled: true,
        adaptivePosition: true
    };
    formSearchReports: FormGroup;
    reports: any[] = [];
    reportsSelected: any[] = []
    clickSuscliption: Subscription | undefined;
    page: number = 0;
    PAGE_SIZE: number = 10;
    totalElements: number = 0;

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslateService,
        private comunService: ComunesService,
        private reportesService: ReportesService,
        private globals: Globals,
        private fc: FuncionesComunesComponent
    ) { }

    ngOnInit(): void {
        this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 5) {
                this.clearForm();
            }
        });
    }

    createForm() {
        this.formSearchReports = this.fb.group({
            from: [new Date()],
            to: [new Date()],
            nombreReporte: ['']
        });
    }

    searchFiles($event?: any): void {
        if (!this.validataDates(this.formSearchReports.value)) {
            return;
        }

        if ($event) {
            this.reportsSelected = [];
            this.page = 0;
        }

        const body = {
            fechaInicio: format(new Date(this.formSearchReports.value?.from), 'dd/MM/yyyy'),
            fechaFin: format(new Date(this.formSearchReports.value?.to), 'dd/MM/yyyy'),
            archivo: this.formSearchReports.get('nombreReporte')?.value
        };
        this.reportesService.obtenerArchivos(body, this.page, this.PAGE_SIZE).then((resp) => {
            if (!resp.empty) {
                this.reports = resp.content;
                this.totalElements = resp.totalElements;
            } else {
                this.open(
                    this.translateService.instant('buzon.msjINFOOKTitulo'),
                    this.translateService.instant('reportes.exception.mensaje'),
                    '',
                    'info',
                    '',
                );
            }
        }).catch(() => {
            this.open(
                this.translateService.instant('modal.msjERRGEN0001Titulo'),
                this.translateService.instant('modal.msjERRGEN0001Sugerencia'),
                this.translateService.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translateService.instant('modal.msjERRGEN0001Codigo'),

            );
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    validataDates(request: { from: Date; to: Date }): boolean {
        const differenceDays = differenceInDays(
            new Date().setHours(0, 0),
            request.from.setHours(0, 0)
        );
        if (request.from > request.to) {
            this.open(
                this.translateService.instant('buzon.msjINFOOKTitulo'),
                this.translateService.instant('reportes.captacion.valid.fechaIniMenor'),
                '',
                'info',
                ''
            );
            return false;
        } else if (differenceDays >= 90) {
            this.open(
                this.translateService.instant('buzon.msjINFOOKTitulo'),
                this.translateService.instant('reportes.captacion.valid.antigFecha'),
                '',
                'info',
                ''
            );
            return false;
        }
        return true;
    }

    setAllCheckBoxes(event: any): void {

        const allReports = document.getElementsByName("activeCheckTable");
        const isChecked = event.target.checked;

        allReports.forEach((r: any, i) => {

            if (isChecked) {
                const selectedReport = this.reports[i];
                r.checked = true;
                this.isSelected(selectedReport);
            } else {
                r.checked = false;
                this.reportsSelected = [];
            }

        })

    }

    isSelected(report: any): void {
        (this.reportsSelected.findIndex(r => r.idReporte === report.idReporte) !== -1) ?
            this.reportsSelected = this.reportsSelected.filter((value) => value.idReporte !== report.idReporte) :
            this.reportsSelected.push(report);
    }

    clearForm(): void {
        this.reports = [];
        this.reportsSelected = []
        this.createForm();
    }

    exportReports(): void {
        if (this.reportsSelected.length <= 0) {
            this.open(
                this.translateService.instant('reportes.exception.MONOP003'),
                this.translateService.instant('monitoreo.monitorSlados.observacion'),
                '',
                'alert',
                ''
            );
            return;
        } else {
            const body = {
                idReportes: this.reportsSelected.map(item => item.idReporte.toString())
            }
            this.reportesService.obtenerZIP(body).then(resp => {
                if (resp.data) {
                    /** Se manda la informacion para realizar la descarga del archivo */
                    this.fc.convertBase64ToDownloadFileInExport(resp);
                    this.globals.loaderSubscripcion.emit(false);
                }
            }).catch(() => {
                this.open(
                    this.translateService.instant('modal.msjERRGEN0001Titulo'),
                    this.translateService.instant('modal.msjERRGEN0001Sugerencia'),
                    this.translateService.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translateService.instant('modal.msjERRGEN0001Codigo'),

                );
            }).finally(() =>
                this.globals.loaderSubscripcion.emit(false)
            );
        }
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
    }

    onPageChanged(event: any) {
        this.page = event.page - 1;
        this.searchFiles();
    }

    open(
        titulo: String,
        sugerencia: string,
        contenido: String,
        type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
        code?: string
    ): MatDialogRef<ModalInfoComponent, any> {
        return this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                titulo,
                contenido,
                type,
                code,
                sugerencia
            ),
            hasBackdrop: true,
        });
    }

    validaKey(e: any) {
        var key;
        var specialKeys;
        var spacePuntoGuionBajo;
        
        window.event ? key = e.keyCode :  key = e.which;
        specialKeys = (!window.event && (e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)) ? true : false; 
        spacePuntoGuionBajo = (key == 32 || key == 46 || key == 95)? true : false 
                
        return ((key >= 48 && key <= 57)||(key > 64 && key < 91) || (key > 96 && key < 123) || key == 8 || spacePuntoGuionBajo || specialKeys);
    }

}
