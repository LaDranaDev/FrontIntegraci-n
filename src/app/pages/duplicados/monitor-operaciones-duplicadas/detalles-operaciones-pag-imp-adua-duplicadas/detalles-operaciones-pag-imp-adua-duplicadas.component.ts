import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { DatePipe } from "@angular/common";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { MonitorArchivosDuplicadosService } from 'src/app/services/duplicados/monitor-archivos-duplicados.service';
import { ProcesarDatos } from '../procesar-datos';

@Component({
  selector: 'app-detalles-operaciones-pag-imp-adua-duplicadas',
  templateUrl: './detalles-operaciones-pag-imp-adua-duplicadas.component.html',
  styleUrls: ['./detalles-operaciones-pag-imp-adua-duplicadas.component.css']
})
export class DetallesOperacionesPagImpAduaDuplicadasComponent implements OnInit {
  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia = 's'
  rechazo: boolean=false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
    private monitorArchivosDup: MonitorArchivosDuplicadosService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private procesarCl: ProcesarDatos,

  ) {
      this.datosForm = this.initializeForm();
    }

  async ngOnInit() {
    this.monitor.setSaveLocalStorage('regrese', null);
    this.operaciones = this.monitor.getSaveLocalStorage('operaciones');
    console.log(this.operaciones);

    let det = {
      'idProducto': this.operaciones.idProducto,
      'idOperacion': this.operaciones.idOperacion,
    }
    try{
      await this.monitor.detalles(det).then(
        async (resp:any)=>{
        if(resp.code === '500'){
          this.open('Error', resp.message, 'error');
        }
        this.datosForm.patchValue({
          producto: resp.producto,
          codCli: resp.codCli,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          fechaAplic:resp.fechaAplic,
          nomArch:resp.nomArch,
          lineaCaptura:resp.lineaCaptura,
          idOperacion: resp.idOperacion,
          transSat:resp.transSat,
          nombreOrd:resp.nombreOrd,
          ctaCargo:resp.ctaCargo === '-1' ? 'ErrorCampo' : resp.ctaCargo,
          patente:resp.patente,
          pedimento:resp.pedimento,
          aduana:resp.aduana,
          divisa:resp.divisa,
          importe:resp.importe,
          mensaje: resp.descError,
        })
        this.id = resp.idProducto
        this.idEstatus= resp.idEstatus
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
    }
  }
  private initializeForm() {
    return this.formBuilder.group({
      producto:[{value:'' , disabled: true}],
      codCli:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      fechaAplic:[{value: '', disabled: true}],
      nomArch:[{value: '', disabled: true}],
      lineaCaptura:[{value: '', disabled: true}],
      idOperacion:[{value: '', disabled: true}],
      transSat:[{value: '', disabled: true}],
      nombreOrd:[{value: '', disabled: true}],
      ctaCargo:[{value: '', disabled: true}],
      patente:[{value: '', disabled: true}],
      pedimento:[{value: '', disabled: true}],
      aduana:[{value: '', disabled: true}],
      divisa:[{value: '', disabled: true}],
      importe:[{value: '', disabled: true}],
      mensaje:[{value: '', disabled: true}],
      razonRechazo:[''],
    })
  }

  regresarAdu(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/duplicados/monitorOperacionesDuplicadas']);

  }
  cancel6(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }
  rechazarAdu(){
    this.rechazo=true
  }
  refrescarAdu(){
    this.ngOnInit()
  }
  //Procesa la solicitud
  procesarAdu(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel6();
   }
   //rechaza la solicitud
  acept6() {
  }

  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        obser,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

}
