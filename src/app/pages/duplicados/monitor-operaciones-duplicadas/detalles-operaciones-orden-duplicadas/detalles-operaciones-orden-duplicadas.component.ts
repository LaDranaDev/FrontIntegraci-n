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
import { ProcesarDatos } from '../procesar-datos';

@Component({
  selector: 'app-detalles-operaciones-orden-duplicadas',
  templateUrl: './detalles-operaciones-orden-duplicadas.component.html',
  styleUrls: ['./detalles-operaciones-orden-duplicadas.component.css']
})
export class DetallesOperacionesOrdenDuplicadasComponent implements OnInit {
  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia = 's'
  rechazo:any = false
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
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
        this.id = resp.idProducto
        this.idEstatus= resp.idEstatus
        this.datosForm.patchValue({
          nombreBenef: resp.nombreBenef,
          ctaCargo: resp.ctaCargo === '-1' ? 'ErrorCampo' : resp.ctaCargo,
          fechaAplic:resp.fechaAplic,
          fechaLimitPago:resp.fechaLimitPago,
          fechaCaptura:resp.fechaCaptura,
          numSucursal:resp.numSucursal,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          tipoPago: resp.tipoPago,
          referencia:resp.referencia,
          importe:resp.importe,
          numOrden:resp.numOrden,
          modalidad:resp.modalidad,
          referenciaAbono:resp.referenciaAbono,
          referenciaCargo:resp.referenciaCargo,
          mensaje:resp.mensaje,
          mensajeOrden: resp.mensajeOrden
        })
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
      nombreBenef:[{value:'' , disabled: true}],
      ctaCargo:[{value: '', disabled: true}],
      fechaAplic:[{value: '', disabled: true}],
      fechaLimitPago:[{value: '', disabled: true}],
      fechaCaptura:[{value: '', disabled: true}],
      importe:[{value: '', disabled: true}],
      numOrden:[{value: '', disabled: true}],
      modalidad:[{value: '', disabled: true}],
      referenciaAbono:[{value: '', disabled: true}],
      referenciaCargo:[{value: '', disabled: true}],
      numSucursal:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      tipoPago:[{value: '', disabled: true}],
      referencia:[{value: '', disabled: true}],
      mensajeOrden:[{value: '', disabled: true}],
      mensaje:[{value: '', disabled: true}],
      razonRechazo:[''],

    })
  }

  regresarOP(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/duplicados/monitorOperacionesDuplicadas']);
  }
  cancel4(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }
  rechazarOP(){
    this.rechazo=true
  }
  refrescarOP(){
    this.ngOnInit()
  }
  procesarOP(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel4();
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
