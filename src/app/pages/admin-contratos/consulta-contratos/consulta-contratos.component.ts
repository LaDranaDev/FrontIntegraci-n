import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-consulta-contratos',
  templateUrl: './consulta-contratos.component.html',
  styleUrls: ['./consulta-contratos.component.css']
})
export class ConsultaContratosComponent implements OnInit, OnDestroy {


  fechaInicio: string = new UntypedFormControl(new Date().toISOString()).toString();
  fechaFin: string = new UntypedFormControl(new Date().toISOString()).toString();
  dataSource: any;
  displayedColumns: string[] = ['numContrato', 'razonSocial', 'bucCliente', 'descEstatus'];
  datos = {
    numContrato: "", bucCliente: "", descEstatus: "", nombreCompleto: "",
    personalidad: "", cuentaEje: "", idContrato: "", razonSocial: ""
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateInit = new FormControl('', []);
  dateEnd = new FormControl('', []);
  numContrato = new FormControl('', []);
  razonSocial = new FormControl('', []);
  codigoCliente = new FormControl('', []);
  cuentaEje = new FormControl('', []);

  matForm = this.fb.group({
    dateInit: this.dateInit,
    dateEnd: this.dateEnd,
    numContrato: this.numContrato,
    razonSocial: this.razonSocial,
    codigoCliente: this.codigoCliente,
    cuentaEje: this.cuentaEje
  });

  usuarioActual: string | null = '';

  constructor(private globals: Globals,
    private fc: FuncionesComunesComponent,
    private router: Router,
    private fb: UntypedFormBuilder,
    private service: ComunesService,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
  }


  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();

    this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 21) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.btnLimpiar();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  async buscarContratosPorFecha() {
    let fechaInicio = 'null';
    let fechaFin = 'null';

    if (this.dateInit.value && this.dateEnd.value) {
      try {
        fechaInicio = formatDate(this.dateInit.value, 'dd-MM-yyyy', 'en-MX');
        fechaFin = formatDate(this.dateEnd.value, 'dd-MM-yyyy', 'en-MX');


        const msj = await this.validarFechas(this.dateInit.value, this.dateEnd.value)
        if (msj) {
          return this.openModalError(
            'Error',
            this.translateService.instant(msj),
            'error',
            '',
            ''
          )
        }
      } catch {

      }
    } else {
      this.dateInit.setValue('');
      this.dateEnd.setValue('');
    }

    let strValidate = "";
    let requests = {
      dateInit: this.dateInit.value ? fechaInicio : '',
      dateEnd: this.dateEnd.value ? fechaFin : '',
      numContrato: this.numContrato.value && (this.numContrato.value.match("^[0-9]*$") !== null) ? this.numContrato.value : '',
      razonSocial: this.razonSocial.value && (this.razonSocial.value.match("^[a-zA-ZÀ-ú0-9\u00d1 ]*$") !== null) ? this.razonSocial.value.toUpperCase() : '',
      codigoCliente: this.codigoCliente.value && (this.codigoCliente.value.match("^[0-9]*$") !== null) ? this.codigoCliente.value : '',
      cuentaEje: this.cuentaEje.value && (this.cuentaEje.value.match("^[0-9]*$") !== null) ? this.cuentaEje.value : '',
      user: this.usuarioActual
    }

    if (requests.dateInit) {
      strValidate += "Fecha Inicio, ";
    }
    if (requests.dateEnd) {
      strValidate += "Fecha Fin, ";
    }
    if (requests.numContrato) {
      strValidate += "Número de Contrato, ";
    }
    if (requests.razonSocial) {
      strValidate += "Razón Social, ";
    }
    if (requests.codigoCliente) {
      strValidate += "Código del Cliente, ";
    }
    if (requests.cuentaEje) {
      strValidate += "Cuenta Eje, ";
    }

    strValidate = strValidate.slice(0, -2) + '.';

    try {
      await this.service.consultaInformacionClientesGen(requests).then(
        async (resp: any) => {
          if (resp.result.length > 0) {
            this.dataSource = new MatTableDataSource<any>(resp.result);
            setTimeout(() => this.dataSource.paginator = this.paginator);
          }
          this.globals.loaderSubscripcion.emit(false);
          if (resp.result.length === 0) {
            this.openModalError(
              this.translateService.instant('administracion.contratos.msjERR002Titulo'),
              this.translateService.instant('administracion.contratos.msjERR002Observacion'),
              'error',
              this.translateService.instant('administracion.contratos.msjERR002Codigo'),
              this.translateService.instant('administracion.contratos.msjERR002Sugerencia', {
                strValidate
              }),
            )
          }
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.openModalError(
        this.translateService.instant('administracion.contratos.msjERR000Titulo'),
        this.translateService.instant('administracion.contratos.msjERR000Observacion'),
        'error',
        this.translateService.instant('administracion.contratos.msjERR000Codigo'),
        this.translateService.instant('administracion.contratos.msjERR000Sugerencia'),
      )
    }
  }

  getContract(element: any) {
    this.datos.bucCliente = element.bucCliente;
    this.datos.numContrato = element.numContrato;
    this.service.setSaveLocalStorage('activarProducto', true);
    this.router.navigateByUrl(`/admin-contratos/productos/${btoa(JSON.stringify(element))}`);
  }

  getContractElement() {
    return this.datos;
  }

  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {

        let fechaInicio = 'null';
        let fechaFin = 'null';

        if (this.dateInit.value && this.dateEnd.value) {
          try {
            fechaInicio = formatDate(this.dateInit.value, 'dd-MM-yyyy', 'en-MX');
            fechaFin = formatDate(this.dateEnd.value, 'dd-MM-yyyy', 'en-MX');
            const msj = this.validarFechas(this.dateInit.value, this.dateEnd.value)
            if (msj) {
              return this.openModalError(
                'Error',
                this.translateService.instant(msj),
                'error',
                '',
                ''
              )
            }
          } catch {

          }
        }

        let requests = {
          dateInit: this.dateInit.value ? fechaInicio : '',
          dateEnd: this.dateEnd.value ? fechaFin : '',
          numContrato: this.numContrato.value ? this.numContrato.value : '',
          razonSocial: this.razonSocial.value ? this.razonSocial.value.toUpperCase() : '',
          codigoCliente: this.codigoCliente.value ? this.codigoCliente.value : '',
          cuentaEje: this.cuentaEje.value ? this.cuentaEje.value : '',
          user: this.usuarioActual


        }
        this.onClickExportarGC(result, requests);
      }
    });
  }

  async onClickExportarGC(tipoExportacion: string, data: any) {

    if (tipoExportacion === 'xlsx') {
      tipoExportacion = 'xls'
    }
    if (tipoExportacion === 'xls') {
      try {
        await this.service.reporteContratosXls(data).then(
          async (result: any) => {
            if (result.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
            } else {
              if (result.code === '404') {
                this.openModalError('Error', result.message, 'error');
                this.globals.loaderSubscripcion.emit(false);
              } else {
                this.openModalError(
                  'Error',
                  this.translateService.instant('error.exportacion'),
                  'error');
                  this.globals.loaderSubscripcion.emit(false);
              }
            }
          });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.openModalError(
          this.translateService.instant('administracion.contratos.export.msjERR000Titulo'),
          this.translateService.instant('modals.error.exportacion'),
          'error',
          this.translateService.instant('administracion.contratos.export.msjERR000Codigo'),
          this.translateService.instant('administracion.contratos.export.msjERR000Sugerencia'),
        )
      }
    }

    if (tipoExportacion === 'pdf') {
      try {
        await this.service.reporteContratosPdf(data).then(
          async (result: any) => {

            if (result.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
            } else {
              if (result.code === '404') {
                this.openModalError('Error', result.message, 'error');
                this.globals.loaderSubscripcion.emit(false);
              } else {
                this.openModalError(
                  'Error',
                  this.translateService.instant('error.exportacion'),
                  'error');
                  this.globals.loaderSubscripcion.emit(false);
              }
            }
          });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.openModalError(
          this.translateService.instant('administracion.contratos.export.msjERR000Titulo'),
          this.translateService.instant('modals.error.exportacion'),
          'error',
          this.translateService.instant('administracion.contratos.export.msjERR000Codigo'),
          this.translateService.instant('administracion.contratos.export.msjERR000Sugerencia'),
        )
      }
    }

    if (tipoExportacion === 'csv') {
      try {
        await this.service.reporteContratosCSV(data).then((result: any) => {

          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            if (result.code === '404') {
              this.openModalError('Error', result.message, 'error');
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.openModalError(
                'Error',
                this.translateService.instant('error.exportacion'),
                 'error');
              this.globals.loaderSubscripcion.emit(false);
            }
          }
        });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.openModalError(
          this.translateService.instant('administracion.contratos.export.msjERR000Titulo'),
          this.translateService.instant('modals.error.exportacion'),
          'error',
          this.translateService.instant('administracion.contratos.export.msjERR000Codigo'),
          this.translateService.instant('administracion.contratos.export.msjERR000Sugerencia'),
        )
      }
    }




  }

  openModalError(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true 
    });
  }

  btnLimpiar() {
    this.dataSource = null;
    this.matForm.reset();
  }


  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia),hasBackdrop: true 
    });
  }

  validarFechas(iniFecha: string, finFecha: string) {

    let mensajeError: any = null;
    const fechaActual = new Date();

    if (Date.parse(iniFecha) > fechaActual.getTime() || Date.parse(finFecha) > fechaActual.getTime()) {
      mensajeError = 'administracion.contratos.fechaDiaAnterior';
    } else if (Date.parse(iniFecha) > Date.parse(finFecha)) {
      mensajeError = 'menu.sterling.historialBuzon.error.fechaInicioMayorFechaFin';
    }

    return mensajeError;
  }

}
