import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { LimpiaBusquedaService } from 'src/app/services/limpia-busqueda.service';
import { ModalSubsidiariaComponent } from 'src/app/components/modals/modal-subsidiaria/modal-subsidiaria.component';
import { ModalTipoCobroComponents } from 'src/app/bean/modal-tipo-cobro.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Globals } from 'src/app/bean/globals-bean.component';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-tipo-cobro',
  templateUrl: './tipo-cobro.component.html',
  styleUrls: ['./tipo-cobro.component.css']
})
export class TipoCobroComponent implements OnInit {

  public activeLang = 'es';
  opcionCobro: Number = 0;
  voBoCliente:boolean = false;
  catalogoTipoCobro: any[] = [];
  tipoCobro: any;
  numContrato:string = '';
  banderaContrato:boolean = true;
  banderaModalGuardado:boolean = false;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private service: ContratosService,
    private serviceComun: ComunesService,
    private limpiaBusqueda:LimpiaBusquedaService,
    private globals: Globals,
  ) { 
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {}

  contrato($event:any){
    if($event!=''){
      const {numContrato,cuentaEje } = $event
      this.numContrato = numContrato;
      if(numContrato != 'undefined' || numContrato.length>0){
        this.banderaModalGuardado = false;
        this.consultaTipodeCobros(cuentaEje);
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
      }
    });
  }
  consultaTipodeCobros(cuentaEje:any){
    this.service.consultaTipodeCobro(this.numContrato).then((data:any)=>{
      if(data.code == 200){
        if(data.result!=null){
          this.banderaContrato = false;
          this.catalogTiposDeCobro();
          this.tipoCobro = data.result;
          const {idTipoCobro,voBo,cuentaComision } = this.tipoCobro
          this.tipoCobro.cuentaComision = cuentaComision === null ? cuentaEje : cuentaComision;
          this.opcionCobro = this.banderaModalGuardado ? this.opcionCobro : idTipoCobro;
          this.voBoCliente = voBo || false;
          if(idTipoCobro !== null && !this.banderaModalGuardado){this.open(idTipoCobro)} //Temporal aplica solo para subsidiarias
          // if(idTipoCobro !== null && idTipoCobro == '4'  && !this.banderaModalGuardado){this.open(idTipoCobro)}
          this.globals.loaderSubscripcion.emit(false);
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
      //this.dialogoTipoDeCobro(opcion); comentado temporalmente solo para subsidiarias
      this.dialogoTipoDeCobro(4);
    }
    
  }

  dialogoTipoDeCobro(opcion:any){
    const dialog = this.dialog.open(ModalSubsidiariaComponent, {
      disableClose: true,
      data: new ModalTipoCobroComponents(opcion,this.numContrato,this.tipoCobro,this.voBoCliente), hasBackdrop: true 
      }
    );
    dialog.afterClosed().subscribe(result => {
      this.banderaModalGuardado =  true;
     this.consultaTipodeCobros(this.numContrato);
    });
  }

  descargarArchivo(tipoArchivo:any){

    const user = (localStorage.getItem('UserID') == 'undefined')? 'Sin información': localStorage.getItem('UserID');
    this.service.obtieneReporte(user,this.numContrato,tipoArchivo).then((data:any)=>{
      if(data.code == 200){
        if(data.result!=null){
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
          this.openM('',data.status, 'error')
        }

      }
    });
  }

  guardar(){
    const requestPOST = {
      numContrato: this.numContrato,
      idTipoCobro: this.opcionCobro,
      cuentaComision: this.tipoCobro.cuentaComision,
      voBo: this.voBoCliente
    };
    const requestPUT = { idTipoCobro:this.opcionCobro,voBo: this.voBoCliente}
    const { idTipoCobroCntr } = this.tipoCobro;

    if(idTipoCobroCntr == null){
      this.service.altaTipoDeCobro(requestPOST).then((data:any)=>{
        if(data.code == 200){
          this.openM('',data.result, 'info')
        }
      });
    }else{
      this.service.actualizaTipoDeCobro(this.numContrato,idTipoCobroCntr,requestPUT).then((data:any)=>{
        if(data.code == 200){this.openM('',data.result, 'info')}
      });
    }
  }

  limpiar(){
    this.catalogoTipoCobro = [];
    this.voBoCliente = false;
    this.banderaContrato = true;
    this.limpiaBusqueda.vacia();
  }

  openMsg(titulo:String,contenido:String,opcion:any){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido), hasBackdrop: true }
      );
      dialogo.afterClosed().subscribe(result => {
        this.dialogoTipoDeCobro(opcion);
      });
  }

  openM(
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
      ), hasBackdrop: true 
    });
  }

  exportar(){
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.descargarArchivo(result);
      }
    });  
  }


}
