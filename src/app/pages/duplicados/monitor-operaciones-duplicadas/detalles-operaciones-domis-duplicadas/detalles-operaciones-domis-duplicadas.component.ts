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
  selector: 'app-detalles-operaciones-domis-duplicadas',
  templateUrl: './detalles-operaciones-domis-duplicadas.component.html',
  styleUrls: ['./detalles-operaciones-domis-duplicadas.component.css']
})
export class DetallesOperacionesDomisDuplicadasComponent implements OnInit {
  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia:any
  rechazo: boolean=false;
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
      razonRechazo:[''],
    })
  }

  cancel3(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }

  regresar3(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/monitoreo/monitorOperaciones']);
    this.monitor.setSaveLocalStorage('intradia',null);
  }
  rechazar3(){
    this.rechazo= true
  }
  refrescar3(){
    this.ngOnInit()
  }
  procesar3(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel3();
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
