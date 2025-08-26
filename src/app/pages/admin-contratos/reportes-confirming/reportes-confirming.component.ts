import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CanalesBeanComponents } from 'src/app/bean/canales-bean.component';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ReportesConfirmingService } from 'src/app/services/admin-contratos/reportes-confirming.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-reportes-confirming',
  templateUrl: './reportes-confirming.component.html',
  styleUrls: ['./reportes-confirming.component.css']
})
export class ReportesConfirmingComponent implements OnInit {
  datos: any;
  activaCheck1: boolean = false;
  activaCheck2: boolean = false;
  activaCheck3: boolean = false;
  activaCheck4: boolean = false;
  activaCheck5: boolean = false;
  canales: string = '';
  indtx: number = 0;
  canalSelect: any;
  usuarioActual : string | null;

  comboInditex = [
    { id: 1, valor: 1, desc: '1' },
    { id: 2, valor: 2, desc: '2' },
    { id: 3, valor: 3, desc: '3' }
  ];

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

  clickSuscliption: Subscription | undefined;
  canalesBean: CanalesBeanComponents[] = [];
  canal: any;

  reportesConfirming: any = {
    activaCheck1: "",
    activaCheck2: "",
    activaCheck3: "",
    activaCheck4: "",
    activaCheck5: "",
    canales: 0,
    indtx: 0
  }

  constructor(
    private service: ComunesService, 
    private translate: TranslateService,
    private globals: Globals,
    private reportesConfirmingService: ReportesConfirmingService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private fc: FuncionesComunesComponent,
    ) { 
      this.usuarioActual = localStorage.getItem('UserID');
    }


  //FUNCIONES QUE SE EJECUTARAN AL INICIAR LA PANTALLA
  ngOnInit(): void {
    this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 18) {
        this.datos = this.service.datosContrato;
        this.datosContrato = this.datos;
        this.init();
        this.cargaCanales();

      }
    });

  }

  //FUNCION PARA CARGAR LA INFO INICIAL DE REPORTES CONFIRMING
  async init() {

    try {
      await this.reportesConfirmingService.inicioGetConfirming(this.datosContrato.idContrato).then(
        async (datoRes: any) => {
          
          //EN CASO DE NO EXISTIR DATOS SE MOSTRARA UNA PANTALLA INFORMANDOLO
          if(datoRes.message === 'COD_ERR02'){
            this.open(
              this.translate.instant('reporteConfirming.consulta.error'),
              '',
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              ''
            );
            this.globals.loaderSubscripcion.emit(false);
          }

          // CODIGO PARA MOSTRAR LOS DATOS RECIBIDOS DE LA CONSULTA INICIAL
          if(datoRes.reportePagos == 'A'){
            this.reportesConfirming.activaCheck1 = true;
          }

          if(datoRes.repIvaDes == 'A'){
            this.reportesConfirming.activaCheck2 = true;
          }
          if(datoRes.reporteMeses == 'A'){
            this.reportesConfirming.activaCheck4 = true;
          }

          if(datoRes.reporteProveedores == 'A'){
            this.reportesConfirming.activaCheck3 = true;
          }

          if(datoRes.periodoAmpliado == 'A'){
            this.reportesConfirming.activaCheck5 = true;
          }

          this.reportesConfirming.indtx = datoRes.reporteMeses == 'A' ? datoRes.periodoMensual: 1;
          this.reportesConfirming.canales = datoRes.idCanal;

          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /** FUNCION PARA CARGAR LOS CANALES EN EL COMBO */
  async cargaCanales() {
    try {
      await this.reportesConfirmingService.cargaComboCanales(this.datosContrato.idContrato).then(
        async (datosCanales: any) => {

          /** SE AGREGA LA RESPUESTA AL DATO CANAL PARA MOSTRARLOS EN EL COMBOBOX */
          this.canal = datosCanales;

          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /** FUNCION PARA GURDAR LAS MODIFICACIONES HECHAS EN EL REPORTE CONFIRMING */
  async guardarReporte() {

    /** SE CREA EL REQUEST CON LOS LOS DATOS NECESARIOS PARA GUARDAR LOS CAMBIOS */
    const request = {
      "idContrato": this.datosContrato.idContrato,
      "reportePagos": this.reportesConfirming.activaCheck1,
      "repIvaDes": this.reportesConfirming.activaCheck2,
      "reporteProveedores": this.reportesConfirming.activaCheck3,
      "reporteMeses": this.reportesConfirming.activaCheck4,
      "periodoMensual": this.reportesConfirming.indtx,
      "periodoAmpliado": this.reportesConfirming.activaCheck5,
      "idCanal": this.reportesConfirming.canales,
      "numeroContrato": this.datosContrato.numContrato
    }
    
    try {
      await this.reportesConfirmingService.guardarReporteConfirming(request).then(
        async (respGuardar: any) => {
          
          /** SE REALIZA UNA VALIDACION PARA INDICAR SI SE REALIZO EL GUARDADO CORRECTAMENTE */
          if(respGuardar.responseCode === 'OK'){
            this.open(
              this.translate.instant('reporteConfirming.guardado.exito'),
              '',
              'info',
              this.translate.instant('reporteConfirming.msjOKARP01'),
              ''
            );
          }else{
            this.open(
              this.translate.instant('reporteConfirming.guardado.error'),
              '',
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              ''
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /** FUNCION PARA EXPORTAR A PDF - XLS - CSV */
  async exportarArchivo(tipoExportacion: any){

    /*+ SE CREA EL REQUEST CON LOS DATOS QUE SE MOSTRARAN EN EL ARCHIVO EXPORTADO */
    this.canal.forEach((c: any) => {
      if (c.idChannel === this.reportesConfirming.canales) {
        this.canalSelect = c.description;
      }
    });

    const requestExportar = {
      "numContrato": this.datosContrato.numContrato,
      "usuario": this.usuarioActual,
      "codigoCliente": this.datosContrato.bucCliente,
  
      "reportePagos": this.reportesConfirming.activaCheck1,
      "repIvaDes": this.reportesConfirming.activaCheck2,
      "reporteProveedores": this.reportesConfirming.activaCheck3,
      "reporteInditex": this.reportesConfirming.activaCheck4,
      "reporteAmpliado": this.reportesConfirming.activaCheck5,

      "periodoInditex": this.reportesConfirming.indtx,
      "canalConfirming": this.canalSelect,
      "numeroContrato": this.datosContrato.numContrato,
      "razonSocial": this.datosContrato.razonSocial,
      "estatusContrato": this.datosContrato.descEstatus,
      "cuentaEje": this.datosContrato.cuentaEje
    }

    try {

      /** SE REALIZA LA EXPORTACION EN XLSX */
      if(tipoExportacion === 'xlsx'){
        await this.reportesConfirmingService.exportarXls(requestExportar).then(
          async (respGuardar: any) => {
            this.descargaArchivo(respGuardar);
        });

        /** SE REALIZA LA EXPORTACION EN PDF */
      }else if(tipoExportacion === 'pdf'){
        await this.reportesConfirmingService.exportarPdf(requestExportar).then(
          async (respGuardar: any) => {
            this.descargaArchivo(respGuardar);
        });

        /** SE REALIZA LA EXPORTACION EN CSV */
      }else{
        await this.reportesConfirmingService.exportarCsv(requestExportar).then(
          async (respGuardar: any) => {
            this.descargaArchivo(respGuardar);
          });

      }

    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
          '',
          this.translate.instant('EE'),
          'error'
      );
    }

  }

  /** FUNCION PARA REALIZAR LA DESCARGA DEL ARCHIVO A EXPORTAR */
  descargaArchivo(respGuardar: any){
    if (respGuardar.data) {
      /** Se manda la informacion para realizar la descarga del archivo */
      this.fc.convertBase64ToDownloadFileInExport(respGuardar);
      this.globals.loaderSubscripcion.emit(false);
    } else {
      if (respGuardar.code === '404') {
          this.openModalError('Error', respGuardar.message, 'error');
          this.globals.loaderSubscripcion.emit(false);
      } else {
          this.openModalError(
              'Error',
              this.translate.instant('OERE'),
              'error'
          );
          this.globals.loaderSubscripcion.emit(false);
      }
          this.globals.loaderSubscripcion.emit(false);
    }
  }

  //FUNCION PARA LIMPIAR EL FORMULARIO
  limpiar(){
    this.reportesConfirming.activaCheck1 = false;
    this.reportesConfirming.activaCheck2 = false;
    this.reportesConfirming.activaCheck3 = false;
    this.reportesConfirming.activaCheck4 = false;
    this.reportesConfirming.activaCheck5 = false;
  }

  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result: any) => {
        if (result) {
          this.exportarArchivo(result);
        }
    });
  }

  openModalError(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(titulo, obser, type, code),
    });
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

  valuePeriodIndx(event: any){
    const val = event.target.checked;
    this.reportesConfirming.indtx = val ? this.reportesConfirming.indtx: 1
  }
}
