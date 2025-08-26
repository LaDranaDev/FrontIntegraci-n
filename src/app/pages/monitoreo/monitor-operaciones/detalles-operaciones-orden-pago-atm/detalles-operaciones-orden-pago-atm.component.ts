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

@Component({
  selector: 'app-detalles-operaciones-orden-pago-atm',
  templateUrl: './detalles-operaciones-orden-pago-atm.component.html',
  styleUrls: ['./detalles-operaciones-orden-pago-atm.component.css']
})
export class DetallesOperacionesOrdenPagoATMComponent implements OnInit {

  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia = 's'
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ) { 
      this.datosForm = this.initializeForm();
    }

  async ngOnInit() {
    this.monitor.setSaveLocalStorage('regrese', null);
    this.operaciones = this.monitor.getSaveLocalStorage('operaciones');
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
          fechaPresIni:resp.fechaPresIni,
          referencia:resp.referencia,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          nombreOrd:resp.nombreOrd,
          importe:resp.importe,
          mensaje:resp.mensaje,
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
      fechaPresIni:[{value: '', disabled: true}],
      referencia:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      nombreOrd:[{value: '', disabled: true}],
      importe:[{value: '', disabled: true}],
      mensaje:[{value: '', disabled: true}],
    })
  
  }

  regresarATM(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/monitoreo/monitorOperaciones']);
    /*regresar(){
      this.abrir = false;
       this.abrir1= true;
    }*/
  }
  historialATM(){
    this.router.navigate(['/monitoreo/historial']); 
  }
  reintentarATM(){
    var idEst='REPROCESAR'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }
  rechazarATM(){
    var idEst='RECHAZADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus, this.datosForm.value);
  }
  refrescarATM(){
    this.ngOnInit()
  }
  procesarATM(){
    var idEst='PROCESADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }

  reintentar(estatus:any, data:any){
    var idOperacion = data.idOperacion;
    var viewProd = data.vistProd;
    var tabla = data.tabla;
    var estatus = estatus;
    var idEstatus= data.idEstatus
    this.validaReintentos(idOperacion, idEstatus ,tabla, estatus,  Number(this.operaciones.cmbProducto) );
  }

  async validaReintentos(idOperacion:any, idEstatus:any, tabla:any, estatus:any, producto:any){
    try{
      var data ={
        'estatus':estatus,
        'idOperacion':idOperacion,
        'tabla':tabla
      }
      if(estatus === 'REINTENTO'){
        await this.monitor.horario(producto).then(
          async (resp:any)=>{
          this.horario = resp
        })
        if(this.horario){
          await this.monitor.cambiarEstatusOperacion(data).then(
            async(resp:any)=>{
              this.open('Info', this.translate.instant('pantalla.monitor.Inf02.mensaje'),'info', this.translate.instant('pantalla.monitor.Inf02.codigo'))
            if(producto === 21 || producto === 22 ||producto === 23){
              this.router.navigate(['/monitoreo/detallesPIF']);
            }else{
              this.router.navigate(['/monitoreo/detallesOperaciones']);
            }
          })
        }else{
          this.open('Error', this.translate.instant('pantalla.monitor.Inf03.mensaje'), 'info', this.translate.instant('pantalla.monitor.Inf03.codigo'))
        }
      }else{
        await this.monitor.cambiarEstatusOperacion(data).then(
          async(resp:any)=>{
            this.open('Info', this.translate.instant('pantalla.monitor.Inf02.mensaje'),'info', this.translate.instant('pantalla.monitor.Inf02.codigo'))
          if(producto === 21 || producto === 22 ||producto === 23){
            this.router.navigate(['/monitoreo/detallesPIF']);
          }else{
            this.router.navigate(['/monitoreo/detallesOperaciones']);
          }
        })
      }
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
