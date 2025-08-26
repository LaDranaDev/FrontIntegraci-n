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
  selector: 'app-detalles-operaciones-domis',
  templateUrl: './detalles-operaciones-domis.component.html',
  styleUrls: ['./detalles-operaciones-domis.component.css']
})
export class DetallesOperacionesDomisComponent implements OnInit {

  
  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia:any
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
    this.intradia = this.monitor.getSaveLocalStorage('intradia');
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
          producto: resp.producto,
          codCli: resp.codCli,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          fechaAplic:resp.fechaAplic,
          fechaCaptura:resp.fechaCaptura,
          nomArch:resp.nomArch,
          referencia:resp.referencia,
          fechaVenc: resp.fechaVenc,
          horarioProg:resp.horarioProg,
  
          
          bancoOrdenante:resp.bancoOrdenante,
          nombreOrd:resp.nombreOrd,
          ctaCargo:resp.ctaCargo === '-1' ? 'ErrorCampo' : resp.ctaCargo,
          divisaOrd:resp.divisaOrd,
          importeCargo:resp.importeCargo,
  
         
          bancoReceptor:resp.bancoReceptor,
          nombreBenef:resp.nombreBenef,
          numeMovil:resp.numeMovil,
          ctaAbono:resp.ctaAbono,
          divisa:resp.divisa,
          importe:resp.importe,
          comentario: resp.mensaje
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
      producto:[{value:'' , disabled: true}],
      codCli:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      fechaAplic:[{value: '', disabled: true}],
      fechaCaptura:[{value: '', disabled: true}],
      nomArch:[{value: '', disabled: true}],
      referencia:[{value: '', disabled: true}],
      fechaVenc:[{value: '', disabled: true}],
      horarioProg:[{value: '', disabled: true}],

      bancoOrdenante:[{value: '', disabled: true}],
      nombreOrd:[{value: '', disabled: true}],
      ctaCargo:[{value: '', disabled: true}],
      divisaOrd:[{value: '', disabled: true}],
      importeCargo:[{value: '', disabled: true}],

      iva:[{value: '', disabled: true}],
      claveDes:[{value: '', disabled: true}],
      tipoCambio:[{value: '', disabled: true}],
      bancoIntermediario:[{value: '', disabled: true}],
      bancoPagador:[{value: '', disabled: true}],
      bancoReceptor:[{value: '', disabled: true}],
      vostroCta :[{value: '', disabled: true}],
      nombreBenef :[{value: '', disabled: true}],
      numeMovil:[{value: '', disabled: true}],
      ctaAbono:[{value: '', disabled: true}],
      divisa:[{value: '', disabled: true}],
      importe:[{value: '', disabled: true}],
      comentario:[{value: '', disabled: true}],
    })
  
  }

  regresar3(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/monitoreo/monitorOperaciones']);
    this.monitor.setSaveLocalStorage('intradia',null);
  }
  historial3(){
    this.router.navigate(['/monitoreo/historial']); 
  }
  reintentar3(){
    var idEst='REPROCESAR'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }
  rechazar3(){
    var idEst='RECHAZADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus, this.datosForm.value);
  }
  refrescar3(){
    this.ngOnInit()
  }
  procesar3(){
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
          this.open('Info', this.translate.instant('pantalla.monitor.Inf03.mensaje'), 'info', this.translate.instant('pantalla.monitor.Inf03.codigo'))
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
