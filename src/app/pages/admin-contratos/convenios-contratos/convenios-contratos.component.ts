import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-convenios-contratos',
  templateUrl: './convenios-contratos.component.html',
  styleUrls: ['./convenios-contratos.component.css'],
})
export class ConveniosContratosComponent implements OnInit, OnDestroy {
  /** Lista de valores del estatus del contrato */
  dataSourceRoles: any;
  buscar = false;
  displayedColumnsRoles: string[] = [
    'claveServicio',
    'descr',
    'numCuenta',
    'descEstatus',
  ];
  arrDataTable: any;
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

  convenio = new UntypedFormControl('', []);
  cuenta = new UntypedFormControl('', []);
  desc = new UntypedFormControl('', []);

  convenio2 = new UntypedFormControl('', []);
  desc2 = new UntypedFormControl('', []);

  matForm = this.fb.group({
    convenio: this.convenio,
    desc: this.desc,
    cuenta: this.cuenta,
  });

  convEnContrato = this.fb.group({
    convenio2: this.convenio2,
    desc2: this.desc2,
  });

  usuarioActual: string | null = '';

  constructor(
    private globals: Globals,
    private fb: UntypedFormBuilder,
    private fc: FuncionesComunesComponent,
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
      if (codeMenu === 16) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.matForm.reset();
    this.convEnContrato.reset();
    this.datos = this.service.getDatos();
    this.matForm.controls['cuenta'].disable();
    this.consultaConveniosPorCliente();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  async consultaConveniosPorCliente() {
    try {
      await this.service
        .consultaConveniosPorCliente('1')
        .then(async (resp: any) => {
          this.arrDataTable = resp.result;
          this.dataSourceRoles = new MatTableDataSource<any>(this.arrDataTable);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant(
          'administracion.conveniosContratos.msjGENERR0001Observacion'
        ),
        'error'
      );
    }
  }

  async buscarConveniosDisponibles() {
    if (!this.convenio.value) {
      this.convenio.setValue('null');
    } else {
      this.desc.setValue('null');
    }
    if (!this.desc.value) {
      this.desc.setValue('null');
    }
    let first;
    if (
      (this.convenio.value || this.desc.value) &&
      (this.convenio.value !== 'null' || this.desc.value !== 'null')
    ) {
      await this.service
        .consultaConveniosDisponibles(this.convenio.value, this.desc.value)
        .then(async (resp: any) => {
          this.dataSourceRoles = new MatTableDataSource<any>(this.arrDataTable);
          try {
            if (resp.result !== null) {
              this.buscar = true;
              first = resp.result[0];
              this.convenio.setValue(first.claveServicio);
              this.desc.setValue(first.descr);
              this.cuenta.setValue(first.numCuenta);
            } else {
              this.open(
                this.translateService.instant(
                  'convenios.errores.msjERR001Titulo'
                ),
                this.translateService.instant(
                  'convenios.errores.msjERR001Observacion'
                ),
                'error',
                this.translateService.instant(
                  'convenios.errores.msjERR001Codigo'
                ),
                this.translateService.instant(
                  'convenios.errores.msjERR001Sugerencia'
                )
              );
              this.desc.setValue('');
              this.convenio.setValue('');
              this.cuenta.setValue('');
              this.buscar = false;
            }
          } catch (e) {
            this.desc.setValue('');
            this.convenio.setValue('');
            this.cuenta.setValue('');
            this.buscar = false;
            this.globals.loaderSubscripcion.emit(false);
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } else {
      this.open(
        'Info',
        this.translateService.instant('convenios.validaciones.filtros'),
        'info'
      );
      this.desc.setValue('');
      this.convenio.setValue('');
      this.cuenta.setValue('');
      this.buscar = false;
    }
  }

  buscarConveniosEnContrato(conv: any, descr: any) {
    if (
      ((conv && conv.length === 7) || (descr && conv.length === 0)) &&
      this.arrDataTable !== null
    ) {
      let dataTable = this.arrDataTable;
      let newData: any[] = [];
      dataTable.map((x: any) => {
        if (
          x.claveServicio.toString() === conv.toString() ||
          x.descr.trim().toUpperCase() === descr.trim().toUpperCase()
        ) {
          newData.push(x);
        } else {
          if (
            (x.descr
              .trim()
              .toUpperCase()
              .includes(descr.trim().toUpperCase()) &&
              descr) ||
            (x.claveServicio.toString().includes(conv.toString()) &&
              conv.toString())
          )
            newData.push(x);
        }
      });
      dataTable = newData;
      if (!conv && !descr) {
        dataTable = this.arrDataTable;
      }
      this.dataSourceRoles = new MatTableDataSource<any>(dataTable);
      this.convEnContrato.reset();
      this.matForm.reset();
    }

    if (!conv && !descr) {
      this.open(
        'Info',
        this.translateService.instant('convenios.validaciones.filtros'),
        'info'
      );
    }

    if (conv.length < 7 && conv.length !== 0) {
      this.open(
        'Info',
        this.translateService.instant('convenios.validaciones.convenio4'),
        'info'
      );
    }
  }

  async eliminarConvenio(id_cntr: any, claveServicio: any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translateService.instant('convenios.validaciones.eliminaCnv'),
        'confirm'
      ),
      hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.service
            .eliminaConvenio(id_cntr, claveServicio)
            .then(async (resp: any) => {
              if (resp.status == null) {
                this.open(
                  this.translateService.instant(
                    'convenios.errores.msjOK0002Titulo'
                  ),
                  this.translateService.instant(
                    'convenios.errores.msjOK0002Observacion'
                  ),
                  'error',
                  this.translateService.instant(
                    'convenios.errores.msjOK0002Codigo'
                  ),
                  this.translateService.instant(
                    'convenios.errores.msjOK0002Sugerencia'
                  )
                );
              }
              this.globals.loaderSubscripcion.emit(false);
              this.consultaConveniosPorCliente();
            });
        } catch (e) {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translateService.instant('convenios.errores.msjERR005Titulo'),
            this.translateService.instant(
              'convenios.errores.msjERR005Observacion'
            ),
            'error',
            this.translateService.instant('convenios.errores.msjERR005Codigo'),
            this.translateService.instant(
              'convenios.errores.msjERR005Sugerencia'
            )
          );
        }
      }
    });
  }

  async insertarConvenio(claveServicio: any) {
    this.dataSourceRoles = new MatTableDataSource<any>(this.arrDataTable);
    if (claveServicio && this.buscar) {
      try {
        await this.service
          .insertaConvenio(this.datos.idContrato, claveServicio)
          .then(async (resp: any) => {
            if (resp) {
              this.open(
                this.translateService.instant('pantalla.archivo.consulta.msjERRTitulo'),
                '',
                'info',
                this.translateService.instant('pantalla.conveniosContratos.OK0001'),
                this.translateService.instant('pantalla.conveniosContratos.msjOK0001')
              );
            } else {
              this.open(
                this.translateService.instant('pantalla.archivo.consulta.msjERRTitulo'),
                this.translateService.instant('convenios.errores.msjERR001Observacion'),
                'error',
                this.translateService.instant('parametros.contrato.msjERR008Codigo'),
                this.translateService.instant('pantalla.conveniosContratos.msjERR008')
              );
            }
            this.buscar = false;
            this.matForm.reset();
            this.globals.loaderSubscripcion.emit(false);
            this.consultaConveniosPorCliente();
          });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translateService.instant('convenios.errores.msjERR004Titulo'),
            this.translateService.instant(
              'convenios.errores.msjERR004Observacion'
            ),
            'error',
            this.translateService.instant('convenios.errores.msjERR004Codigo'),
            this.translateService.instant(
              'convenios.errores.msjERR004Sugerencia'
            )
        );
      }
    } else {
      this.open(
        this.translateService.instant('pantalla.archivo.consulta.msjERRTitulo'),
        this.translateService.instant('convenios.errores.msjERR001Observacion'),
        'error',
        this.translateService.instant('contingencia.msjERR003Codigo'),
        this.translateService.instant('pantalla.conveniosContratos.msjERR003')
      );
    }
  }

  contrato(event: any) {}

  export() {
    let dataTable = this.arrDataTable;
    let dialogo;

    if (dataTable !== null) {
      dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });

      dialogo.afterClosed().subscribe((formato) => {
        if (formato) {
          let envio = {
            numeroContrato: this.datos.numContrato,
            idCntr: this.datos.idContrato,
            usuario: this.usuarioActual,
          };

          this.generateReporte(formato, envio);
        }
      });
    } else {
      this.open(
        'Error',
        this.translateService.instant(
          'administracion.conveniosContratos.msjGENERR0001Observacion'
        ),
        'error'
      );
    }
  }

  generateReporte(formato: string, envio: any) {
    if (formato === 'xlsx' || formato === 'csv') {
      this.reportXls(envio);
    } else {
      this.reportPdf(envio);
    }
  }

  async reportPdf(envio: any) {
    try {
      await this.service.reportePdf(envio).then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message), 'error';
          } else {
            this.open(
              'Error',
              this.translateService.instant('modals.error.exportacion'),
              'error'
            );
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  async reportXls(envio: any) {
    try {
      await this.service.reporteXls(envio).then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message, 'error');
          } else {
            this.open(
              'Error',
              this.translateService.instant('modals.error.exportacion'),
              'error'
            );
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  async exportConvDisponibles() {
    let envio = {
      numeroContrato: this.datos.numContrato,
      idCntr: this.datos.idContrato,
      usuario: this.usuarioActual,
    };
    try {
      await this.service
        .reportPdfConvDisponibles(envio)
        .then(async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'errpr');
            } else {
              this.open(
                'Error',
                this.translateService.instant('modals.error.exportacion'), 'error'
              );
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  open(
    titulo: string,
    contenido: string,
    type?: any,
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
}
