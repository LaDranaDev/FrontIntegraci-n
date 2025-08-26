import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConsultaPistasAuditoriaService } from 'src/app/services/consultas-reportes/consulta-pistas-auditoria.service';


@Component({
  selector: 'app-consulta-pistas-auditoria',
  templateUrl: './consulta-pistas-auditoria.component.html',
  styleUrls: ['./consulta-pistas-auditoria.component.css']
})
export class ConsultaPistasAuditoriaComponent implements OnInit, OnDestroy {
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-red',
      showWeekNumbers: false,
      adaptivePosition: true
    }
  );

  pistaAuditoriaForm: FormGroup;
  clickSuscliption: Subscription | undefined;
  listaModulos: any;
  listaTransacciones: any;
  listaTabla: any = [];
  listaTablaMostrar: any = [];
  showTable: boolean = false;
  rowsPorPagina: number = 10;
  totalElements: number = 0;
  usuarioActual: string | null = '';
  constructor(
    private formBuilder: FormBuilder,
    private comunService: ComunesService,
    private service: ConsultaPistasAuditoriaService,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private translate: TranslateService,


  ) {
    this.pistaAuditoriaForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      modulo: [0, Validators.required],
      transaccion: ['-1', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
    });

    this.usuarioActual = localStorage.getItem('UserID');
  }

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.reloadPage();
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  open(titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    }
    );
  }

  async reloadPage() {
    this.onClickClean()
    const { listaModulos, listaTransacciones, listaBitacora } = await this.service.inicioPistas();
    this.listaModulos = listaModulos;
    this.listaTransacciones = listaTransacciones;

    this.globals.loaderSubscripcion.emit(false);


  }

  onClickClean() {
    this.totalElements = 0;
    this.listaTabla = [];
    this.listaTablaMostrar = [];
    this.showTable = false;
    this.pistaAuditoriaForm?.reset();
    this.pistaAuditoriaForm?.controls['fechaInicio']?.setValue(
      new Date()
    );
    this.pistaAuditoriaForm?.controls['fechaFin']?.setValue(new Date());
  }

  async eventoConsultar() {
    const payload = this.construirPayload()
    try {
      // if (!this.compare_dates(payload.fechaInicio, payload.fechaFin)) {
      const { listaBitacora = {} } = await this.service.consultaPistasAuditoria(payload);
      this.globals.loaderSubscripcion.emit(false);
      console.log('listabitacora: '+listaBitacora.length);
     // const { content = [] } = listaBitacora;
      //console.log('listabitacora: '+content.length);
      this.listaTabla = listaBitacora;


      if (this.listaTabla.length > 0) {
        this.totalElements = this.listaTabla.length;
        this.showTable = true
        this.listaTablaMostrar = this.listaTabla.slice(0, this.rowsPorPagina)
      } else {
        this.showTable = false
        this.onClickClean()
        return this.open('Error', '', 'info', 'CODAVISO00011', this.translate.instant('pantalla.pistasAuditoria.consultaVacia'));

      }

    } catch (error) {
      this.showTable = false;
      this.onClickClean();
      this.globals.loaderSubscripcion.emit(false);
      return this.open('Error', '', 'info', 'CODAVISO00011', this.translate.instant('pantalla.pistasAuditoria.consultaVacia'));
      
    }
  }

  async exportar() {
    const payload = this.construirPayload();
    try {
      if (!this.compare_dates(payload.fechaInicio, payload.fechaFin)) {
        const file = await this.service.exportarPistasAuditoria(payload)
        this.fc.convertBase64ToDownloadFileInExport(file);
      } else {
        return this.open('Error', this.translate.instant('pantalla.pistasAuditoria.fechafin.mayor.fechainicio'), 'error', 'ERROR00001', this.translate.instant('pantalla.pistasAuditoria.fechas.invalidas'));
      }

    } catch (error) {
      this.open('Error', this.translate.instant('administracion.consultaABA.errorExcel'), 'error');
    }
    this.globals.loaderSubscripcion.emit(false);
    
  }

  construirPayload() {
    const transaccion = this.pistaAuditoriaForm.get('transaccion')?.value ? this.pistaAuditoriaForm.get('transaccion')?.value : '';
    const usuario = this.pistaAuditoriaForm.get('usuario')?.value ? this.pistaAuditoriaForm.get('usuario')?.value : '';
    const claveModulo = this.pistaAuditoriaForm.get('modulo')?.value ? this.pistaAuditoriaForm.get('modulo')?.value : '';
    return {
      fechaInicio: format(this.pistaAuditoriaForm.get('fechaInicio')?.value, 'dd/MM/yyyy'),
      fechaFin: format(this.pistaAuditoriaForm.get('fechaFin')?.value, 'dd/MM/yyyy'),
      transaccion: transaccion,
      usuario: this.usuarioActual,
      usuarioCons: usuario,
      claveModulo: claveModulo,
    }
  }

  compare_dates(fecha: string, fecha2: string) {
    var xMonth = fecha.substring(3, 5);
    var xDay = fecha.substring(0, 2);
    var xYear = fecha.substring(6, 10);
    var yMonth = fecha2.substring(3, 5);
    var yDay = fecha2.substring(0, 2);
    var yYear = fecha2.substring(6, 10);

    if (xYear > yYear) {
      return (true)
    }
    else {
      if (xYear == yYear) {
        if (xMonth > yMonth) {
          return (true)
        }
        else {
          if (xMonth == yMonth) {
            if (xDay > yDay)
              return (true);
            else
              return (false);
          }
          else
            return (false);
        }
      }
      else
        return (false);
    }
  }

  onPageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaTablaMostrar = this.listaTabla.slice(startItem, endItem);
  }
}
