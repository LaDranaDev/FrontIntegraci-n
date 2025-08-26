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
  selector: 'app-detalles-operaciones-pago-direct',
  templateUrl: './detalles-operaciones-pago-direct.component.html',
  styleUrls: ['./detalles-operaciones-pago-direct.component.css']
})
export class DetallesOperacionesPagoDirectComponent implements OnInit {

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
    private translate: TranslateService) { 
      this.datosForm = this.initializeForm();
    }

  async ngOnInit(){
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
          this.open(this.translate.instant('menu.sterling.historialBuzon.error'), resp.message, 'error');
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
          
          importe:resp.importe,
          numOrden:resp.numOrden,
          referenciaAbono:resp.referenciaAbono,     
          mensaje:resp.mensaje,
          mensajeOrden: resp.mensajeOrden
        })
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }
  private initializeForm() {
    return this.formBuilder.group({
      nombreBenef:[{value:'' , disabled: true}],
      ctaCargo:[{value: '', disabled: true}],
      fechaAplic:[{value: '', disabled: true}],
      fechaLimitPago:[{value: '', disabled: true}],
      fechaCaptura:[{value: '', disabled: true}],
      
      numSucursal:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      tipoPago:[{value: '', disabled: true}],

      importe:[{value: '', disabled: true}],
      numOrden:[{value: '', disabled: true}],
      referenciaAbono:[{value: '', disabled: true}],
     
      mensajeOrden:[{value: '', disabled: true}],
      mensaje:[{value: '', disabled: true}],
    })
  
  }

  regresarPD(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/monitoreo/monitorOperaciones']);
    /*regresar(){
      this.abrir = false;
       this.abrir1= true;
    }*/
  }
  historialPD(){
    this.router.navigate(['/monitoreo/historial']); 
  }
  reintentarPD(){
    var idEst='REPROCESAR'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }
  rechazarPD(){
    var idEst='RECHAZADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus, this.datosForm.value);
  }
  refrescarPD(){
    this.ngOnInit()
  }
  procesarPD(){
    var idEst='PROCESADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus, this.datosForm.value);
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
            this.open(this.translate.instant('pantalla.monitor.Inf02.Titulo'),this.translate.instant('pantalla.monitor.Inf02.observacion'),'info',this.translate.instant('pantalla.monitor.Inf02.codigo'),this.translate.instant('pantalla.monitor.Inf02.Sugerencia'));
            if(producto === 21 || producto === 22 ||producto === 23){
              this.router.navigate(['/monitoreo/detallesPIF']);
            }else{
              this.router.navigate(['/monitoreo/detallesOperaciones']);
            }
          })
        }else{
          this.open(this.translate.instant('pantalla.monitor.Inf03.Titulo'),this.translate.instant('pantalla.monitor.Inf03.observacion'),'info',this.translate.instant('pantalla.monitor.Inf03.codigo'),this.translate.instant('pantalla.monitor.Inf03.Sugerencia'));
        }
      }else{
        await this.monitor.cambiarEstatusOperacion(data).then(
          async(resp:any)=>{
          this.open(this.translate.instant('pantalla.monitor.Inf02.Titulo'),this.translate.instant('pantalla.monitor.Inf02.observacion'),'info',this.translate.instant('pantalla.monitor.Inf02.codigo'),this.translate.instant('pantalla.monitor.Inf02.Sugerencia'));
          if(producto === 21 || producto === 22 ||producto === 23){
            this.router.navigate(['/monitoreo/detallesPIF']);
          }else{
            this.router.navigate(['/monitoreo/detallesOperaciones']);
          }
        })
      }
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }

  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true
    }
    );
  }

}
