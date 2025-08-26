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
  selector: 'app-detalles-operaciones-duplicadas',
  templateUrl: './detalles-operaciones-duplicadas.component.html',
  styleUrls: ['./detalles-operaciones-duplicadas.component.css']
})
export class DetallesOperacionesDuplicadasComponent implements OnInit {
  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
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

  async ngOnInit(){
    this.monitor.setSaveLocalStorage('regrese', null);
    this.operaciones = this.monitor.getSaveLocalStorage('operaciones');
    this.producto = this.monitor.getSaveLocalStorage('producto');
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

      if(resp.producto !== 'OPERACION_EN_PROCESO'){
        this.id = resp.idProducto
        this.idEstatus= resp.idEstatus
        this.datosForm.patchValue({
          producto: resp.producto,
          codigoCliente: resp.codCli,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          fechaAplicacion:resp.fechaAplic,
          fechaPresentacion:resp.fechaCaptura,
          nombreArchivo:resp.nomArch,
          referencia:resp.referencia,
          fechaVencimiento: resp.fechaVenc,
          horarioProg:resp.horarioProg,
          referencia2:resp.descripcion,
          banco:resp.bancoOrdenante,
          nombre:resp.nombreOrd,
          cuenta:resp.ctaCargo === '-1' ? 'ErrorCampo' : resp.ctaCargo,
          divisaOrd:resp.divisaOrd,
          importeCargo:resp.importeCargo,
          iva:resp.nombreEmpleado,
          claveDes:resp.comentario1,
          tipoCambio:resp.comentario2,
          bancoIntermediario:resp.comentario3,
          bancoPagador:resp.bancoReceptor,
          bancoReceptor:resp.bancoReceptor,
          vostroCta:resp.numeroCuenta,
          nombreBenef:resp.nombreBenef,
          numeMovil:resp.numeMovil,
          ctaAbono:resp.ctaAbono,
          divisa:resp.divisa,
          importe:resp.importe,
          comentario: resp.mensaje,
          numConvenio: resp.numConvenio
        })
      }else{
        this.regresarD();
        this.open(
          this.translate.instant('pantalla.cierre.productos.msjERR005Titulo'),
          resp.mensaje,
          'info',
          "MON_INF04",
          this.translate.instant('DM')
        );
      }
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
      codigoCliente:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      fechaAplicacion:[{value: '', disabled: true}],
      fechaPresentacion:[{value: '', disabled: true}],
      nombreArchivo:[{value: '', disabled: true}],
      referencia:[{value: '', disabled: true}],
      fechaVencimiento:[{value: '', disabled: true}],
      horarioProg:[{value: '', disabled: true}],
      referencia2:[{value: '', disabled: true}],
      banco:[{value: '', disabled: true}],
      nombre:[{value: '', disabled: true}],
      cuenta:[{value: '', disabled: true}],
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
      numConvenio:[{value: '', disabled: true}],
      razonRechazo:[''],
    })
  }

  regresarD(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/duplicados/monitorOperacionesDuplicadas']);
  }

  cancel(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }

  rechazarD(){
    this.rechazo= true
  }
  refrescarD(){
    this.ngOnInit()
  }
  procesarD(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel();
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
