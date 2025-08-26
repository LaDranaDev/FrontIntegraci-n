import { Component, OnInit } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';

import { ModalTipoCobroComponents } from 'src/app/bean/modal-tipo-cobro.component';

import { LimpiaBusquedaService } from 'src/app/services/limpia-busqueda.service';


import * as FileSaver from 'file-saver';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { ModalSubsidiariaComponent } from 'src/app/components/modals/modal-subsidiaria/modal-subsidiaria.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Globals } from 'src/app/bean/globals-bean.component';



@Component({
  selector: 'app-otro',
  templateUrl: './otro.component.html',
  styleUrls: ['./otro.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})

export class OtroComponent {
  public activeLang = 'es';
  opcionCobro: Number = 0;
  voBoCliente:boolean = false;
  catalogoTipoCobro: any[] = [];
  tipoCobro: any;
  numContrato:string = '';
  banderaContrato:boolean = true;
  banderaModalGuardado:boolean = false;
  datos: any;
  isClean: boolean = false;
  datosContrato: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
};


  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private service: ContratosService,
    private limpiaBusqueda:LimpiaBusquedaService,
    private globals: Globals,
    private common: ComunesService,) { 
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
    this.datos = this.common.datosContrato;
    this.contrato(this.datos)
  }

  contrato(dato:any){
    if(dato!=''){
      this.numContrato = this.datos.numContrato;
      if(this.numContrato != 'undefined' || this.numContrato.length>0){
        this.banderaModalGuardado = false;
        this.consultaTipodeCobros(this.datos.cuentaEje);
      }else{
        this.limpiar();
        this.banderaContrato = true;
      }
    }else{
      this.limpiar();
      this.banderaContrato = true;
    }

  }

  catalogTiposDeCobro(){
    this.service.catalogoTipoDeCobro().then((data:any)=>{
      if(data.code == 200){
        this.catalogoTipoCobro = data.result;
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }
  consultaTipodeCobros(cuentaEje:any){
    this.service.consultaTipodeCobro(this.numContrato).then((data:any)=>{
      if(data.code == 200){
        if(data.result!=null){
          this.globals.loaderSubscripcion.emit(false);
          this.banderaContrato = false;
          this.catalogTiposDeCobro();
          this.tipoCobro = data.result;
          const {idTipoCobro,voBo,cuentaComision } = this.tipoCobro
          this.tipoCobro.cuentaComision = cuentaComision === null ? cuentaEje : cuentaComision;
          this.opcionCobro = this.banderaModalGuardado ? this.opcionCobro : idTipoCobro;
          this.voBoCliente = voBo || false;
          if(idTipoCobro !== null && !this.banderaModalGuardado){this.open(idTipoCobro)} //Temporal aplica solo para subsidiarias
          //if(idTipoCobro !== null && idTipoCobro == '4'  && !this.banderaModalGuardado){this.open(idTipoCobro)}
        }
      }
    });
  }

  open(opcion:any){
    if(opcion == 2){
      if(this.tipoCobro.cuentasConfirming.length == 0){
        this.dialogoTipoDeCobro(opcion);
      }else{
        const msg = "La configuración por cuenta pagadora, no es válida para el producto Confirming, favor de registrar una cuenta por cada contrato Confirming.";
        let idx = this.tipoCobro.cuentasConfirming.findIndex((item:any) => item.contratoConfirming != ''); 
        (idx >= 0 )? this.openMsg('Info',msg,opcion) : this.dialogoTipoDeCobro(opcion);
      }
    }else{
      this.dialogoTipoDeCobro(opcion); //comentado temporalmente solo para subsidiarias
      //this.dialogoTipoDeCobro(4);
    }
    
  }

  dialogoTipoDeCobro(opcion:any){
    const dialog = this.dialog.open(ModalSubsidiariaComponent, {
      disableClose: true,
      data: new ModalTipoCobroComponents(opcion,this.numContrato,this.tipoCobro,this.voBoCliente, this.isClean)
      }
    );

    dialog.afterClosed().subscribe(async result => {
      this.banderaModalGuardado =  true;
      this.globals.loaderSubscripcion.emit(true);
      setTimeout(() => {
        this.consultaTipodeCobros(this.numContrato);
      }, 800);
    });
  }

  descargarArchivo(tipoArchivo:any){

    const user = (JSON.parse(localStorage.getItem('perfilamiento') as string).usuario as string);
    this.service.obtieneReporte(user,this.numContrato,tipoArchivo).then((data:any)=>{
      if(data.code == 200){
        if(data.result!=null){
          this.globals.loaderSubscripcion.emit(false);
          const { nombre, content } = data.result;
          const archivo = atob(content);
  
          const byteNumbers = new Array(archivo.length);
          for (let i = 0; i < archivo.length; i++) {
            byteNumbers[i] = archivo.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type:tipoArchivo});
          FileSaver.saveAs(blob,nombre)
        }else{
          this.openM('',data.status)
        }

      }
    });
  }

  guardar(){
    if(!this.opcionCobro){
      this.openM(
        this.translate.instant('modals.usuarioOperantes.infoIncompleta'),
        this.translate.instant('cobroComisiones.msjERR006Observacion'),
        'info',
        'ERR006',
        this.translate.instant('cobroComisiones.msjERR006Sugerencia')
      )
      return;
    }
    const requestPOST = {
      numContrato: this.numContrato,
      idTipoCobro: this.opcionCobro,
      cuentaComision: this.opcionCobro,
      voBo: this.voBoCliente
    };
    const requestPUT = { idTipoCobro:this.opcionCobro,voBo: this.voBoCliente}
    const { idTipoCobroCntr } = this.tipoCobro;

    const modalConfirm = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modal.parametros.confirmacion'),
        this.translate.instant('modal.parametros.confirmacion.pregunta'),
        'confirm',
        'CNF000',
      ),
      hasBackdrop: true 
    });
    modalConfirm.afterClosed().subscribe((r) => {
      if(r === 'ok'){
        if(idTipoCobroCntr == null){
          this.service.altaTipoDeCobro(requestPOST).then((data:any)=>{
            if(data.code == 200){
              this.globals.loaderSubscripcion.emit(false);
              this.openM(this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'), data.result.mensaje, 'info');
            }
          });
        }else{
          this.service.actualizaTipoDeCobro(this.numContrato,idTipoCobroCntr,requestPUT).then((data:any)=>{
            if(data.code == 200){
            this.openM(this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'), data.result.mensaje, 'info')
            this.globals.loaderSubscripcion.emit(false);}
          });
        }
      }
    })
  }

  limpiar(){
    this.voBoCliente = false;
    this.isClean = true;
    this.limpiaBusqueda.vacia();
  }

  openMsg(titulo:String,contenido:String,opcion:any){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido)}
      );
      dialogo.afterClosed().subscribe(result => {
        this.dialogoTipoDeCobro(opcion);
      });
  }

  openM(titulo:String,contenido:String, type?: 'error' | 'info' | 'confirm' | 'alert' |'help' | 'aviso' | 'yesNo', errorCode?: String,  sugerencia?: String,){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido, type, errorCode, sugerencia)}
      );
  }

  abrirMnsj(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ),
      hasBackdrop: true 
    });
  }

  exportar(){
    const dialogo = this.dialog.open(ModalExportacionComponent);
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.descargarArchivo(result);
      }
    });  
  }

  changeValueRadio(): void{
    this.isClean = false;
  }


}
