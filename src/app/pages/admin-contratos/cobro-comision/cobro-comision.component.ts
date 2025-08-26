import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalSubsidiariaComponent } from 'src/app/components/modals/modal-subsidiaria/modal-subsidiaria.component';
import { ModalTipoCobroComponents } from 'src/app/bean/modal-tipo-cobro.component';
import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { LimpiaBusquedaService } from 'src/app/services/limpia-busqueda.service';
import * as FileSaver from 'file-saver';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { CobroComisionService } from 'src/app/services/admin-contratos/cobro-comision.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cobro-comision',
  templateUrl: './cobro-comision.component.html',
  styleUrls: ['./cobro-comision.component.css']
})
export class CobroComisionComponent implements OnInit, OnDestroy {
  public activeLang = 'es';

  banderaContrato:boolean = false;
  voBoCliente:boolean = false;
  tipoCobro: any;

  numContrato:string = '';
  productos: any[];
  config: any;
  prodConfirming: any;
  contratosConfirming: any[];

  ctaRenta1: string;
  ctaRenta2: string;
  ctaRenta3: string;

  opcionCobro: Number = 0;
  catalogoTipoCobro: any[] = [];
  banderaModalGuardado:boolean = false;
  datos = {
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
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private dialog: MatDialog,
    private contratosService: ContratosService,
    private service: CobroComisionService,
    private limpiaBusqueda:LimpiaBusquedaService,
    private serviceComun: ComunesService
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    //this.initForm();

    this.clickSuscliption = this.serviceComun.clickAtion.subscribe(async (resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 14) {
        this.initForm();
      }
    });
  }

  contrato(event:any){
    if(event!=''){
      const {numContrato,cuentaEje } = event
      this.numContrato = numContrato;
      if(numContrato != 'undefined' || numContrato.length>0){
        this.banderaModalGuardado = false;
        this.getDatos(numContrato);
      }else{
        this.limpiar();
        this.banderaContrato = true;
      }
    };


  }

  initForm(){
    this.datos = this.serviceComun.getDatos();
    const cobroContrato = this.serviceComun.datosContrato;
    this.contrato(cobroContrato);
    this.globals.loaderSubscripcion.emit(false);
  }

  ngOnDestroy(): void {
    this.clickSuscliption?.unsubscribe();
  }

  getDatos(numContrato: string) {
    this.service.getData(numContrato).then(response => {
      this.config = response.config;
      if (response.config) {
        this.voBoCliente = response.config.voBo == 'A';
        this.tipoCobro = response.config.idtTipoCobro;
        this.ctaRenta1 = response.config.numCuenta;
        this.ctaRenta2 = response.config.numCuenta;
        this.ctaRenta3 = response.config.numCuenta;
      }
      this.productos = response.productos;
      this.prodConfirming = response.prodConfirming;
      this.contratosConfirming = response.config.cuentasConfirming;
      this.banderaContrato = response.config.descEstatus === 'CANCELADO' ? true : false;
    }).finally(() =>
      this.globals.loaderSubscripcion.emit(false)
    );
  }

  open(opcion: any) {
    if (opcion == 2) {
      if (this.tipoCobro.cuentasConfirming.length == 0) {
        this.dialogoTipoDeCobro(opcion);
      } else {
        const msg = "La configuración por cuenta pagadora, no es válida para el producto Confirming, favor de registrar una cuenta por cada contrato Confirming.";
        let idx = this.tipoCobro.cuentasConfirming.findIndex((item: any) => item.contratoConfirming != '');
        (idx >= 0) ? this.openMsg('Info', msg, opcion) : this.dialogoTipoDeCobro(opcion);
      }
    } else {
      this.dialogoTipoDeCobro(opcion); //comentado temporalmente solo para subsidiarias
      //this.dialogoTipoDeCobro(4);
    }

  }

  dialogoTipoDeCobro(opcion: any) {

    const dialog = this.dialog.open(ModalSubsidiariaComponent, {
      disableClose: true,
      data: new ModalTipoCobroComponents(opcion, this.datos.numContrato, this.tipoCobro, this.voBoCliente), hasBackdrop: true
    }
    );
    dialog.afterClosed().subscribe(result => {
      this.banderaModalGuardado =  true;
    });
  }

  descargarArchivo(tipoArchivo: any) {
    if ('xlsx' === tipoArchivo) tipoArchivo = 'excel';
    const user = localStorage.getItem('UserID') || 'Sin información';
    this.service.reporte(this.numContrato, tipoArchivo, user).then(result =>
      this.fc.convertBase64ToDownloadFileInExport(result)
    ).finally(() =>
      this.globals.loaderSubscripcion.emit(false)
    );
  }

  guardar(){
    if (!this.tipoCobro) {
      return;
    }

    const tipoCobroAnt = this.config.idtTipoCobro;
    const cambioTipoCobro = tipoCobroAnt != this.tipoCobro;
    this.config.idtTipoCobro = this.tipoCobro;
    this.config.voBo = this.voBoCliente ? 'A' : 'I';

    const validationFlag = this.validations();

    if (!validationFlag) {
      return;
    }

    let numCuenta;
    if (this.tipoCobro == "1") {
      numCuenta = this.ctaRenta1;
    } else if (this.tipoCobro == "2") {
      numCuenta = this.ctaRenta2;
    } else if (this.tipoCobro == "3") {
      numCuenta = this.ctaRenta3;
    }
    this.config.numCuenta = numCuenta;

    const cuentasPorProducto: any = {"0": numCuenta};
    if (this.tipoCobro == "3") {
      this.productos.forEach(producto =>
        cuentasPorProducto[producto.idProducto] = producto.numCuentaComision
      );
    }

    const request = {
      config: this.config,
      cuentasPorProducto: cuentasPorProducto,
      cambioTipoCobro: cambioTipoCobro,
      tipCobro: this.tipoCobro,
      tipoCobroAnt: tipoCobroAnt
    };
    const requestToSave = {
      ...request,
      numeroContrato: this.numContrato
    }
    this.openConfirm(requestToSave)
  }

  limpiar() {
    this.ctaRenta1 = '';
    this.ctaRenta2 = '';
    this.catalogoTipoCobro = [];
    this.voBoCliente = false;
    this.banderaContrato = false;
    this.limpiaBusqueda.vacia();
    this.limpiarContratosConfirming();
  }

  openConfirm(request: any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('general.confirmacion.contratos.titulo'),
        '',
        'confirm',
        '',
        this.translate.instant('general.confirmacion.contratos.sugerencia')
      )
    }
    );
    dialogo.afterClosed().subscribe(result => {
      if(result === 'ok'){
        this.service.put(request).then(() =>
        this.getDatos(this.numContrato)
    ).finally(() =>
      this.globals.loaderSubscripcion.emit(false)
    );
      }
    });
  }

  openMsg(titulo: String, contenido: String, opcion: any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido), hasBackdrop: true
    }
    );
    dialogo.afterClosed().subscribe(result => {
      this.dialogoTipoDeCobro(opcion);
    });
  }

  openM(titulo: String, contenido: String) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido), hasBackdrop: true
    }
    );
  }

  exportar() {
    const dialogo = this.dialog.open(ModalExportacionComponent , { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.descargarArchivo(result);
      }
    });
  }

  limpiarContratosConfirming(){
    this.contratosConfirming.forEach((data)=>{
      data.numCtaComision = ''
    })
  }

  validations(){
    let flag = true;
    let longituderr = false;

    const seleccionado = this.tipoCobro

    if ("1" == seleccionado) {
      if (this.ctaRenta1 === '') {
        flag = false;
      } else if (this.validarLongitud(this.ctaRenta1)) {
        longituderr = true;
        flag = false;
      }
    } else if ("2" == seleccionado) {
      if (this.ctaRenta2 == '') {
        flag = false;
      } else if (this.validarLongitud(this.ctaRenta2)) {
        longituderr = true;
        flag = false;
      }
    } else if ("3" == seleccionado) {
      if (this.ctaRenta2 == '') {
        flag = false;
      } else if (this.validarLongitud(this.ctaRenta2)) {
        longituderr = true;
        flag = false;
      }
    }

    if (longituderr) {
      this.openModalError(
        this.translate.instant('cobroComisiones.msjERR008Titulo'),
        this.translate.instant('cobroComisiones.msjERR008Observacion'),
          'error',
        this.translate.instant('cobroComisiones.msjERR008Codigo'),
        this.translate.instant('cobroComisiones.msjERR008Sugerencia'),
        )
        return flag;
    }
    if ("2" == seleccionado) {
      this.contratosConfirming.some((data) => {
        if (data.numCtaComision === '') {
          flag = false;
          return;
        }
      });
    }

    if ("3" == seleccionado) {
      this.productos.some((data) => {
        if (data.numCuentaComision === '') {
          flag = false;
          return;
        }
      });
    }

    if (!flag) {
      this.openModalError(
        this.translate.instant('cobroComisiones.msjERR005Titulo'),
        this.translate.instant('cobroComisiones.msjERR005Observacion'),
        'info',
        this.translate.instant('cobroComisiones.msjERR005Codigo'),
        this.translate.instant('cobroComisiones.msjERR005Sugerencia'),
      )
    }

    return flag
  }

  validarLongitud(cuenta:string) {
    if (cuenta.length == 11) {
      return false;
    } else {
      return true;
    }
  }

  openModalError(
    titulo: String,
    contenido: String,
    type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code: string,
    sugerencia: string
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
}
