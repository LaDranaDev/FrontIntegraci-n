import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { UntypedFormControl } from '@angular/forms';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { MonitorArchivosDuplicadosService } from 'src/app/services/duplicados/monitor-archivos-duplicados.service';
import { DatosRequest } from 'src/app/bean/archivos-duplicados-bean.components';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { isDate, parse } from 'date-fns';

@Component({
  selector: 'app-monitor-archivos-duplicados',
  templateUrl: './monitor-archivos-duplicados.component.html',
  styleUrls: ['./monitor-archivos-duplicados.css'],

})
export class MonitorArchivosDuplicadosComponent implements OnInit, OnDestroy {


  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    adaptivePosition: true
  });

  constructor(
    private translate: TranslateService,
    private fc: FuncionesComunesComponent
    , public datePipe: DatePipe,
    public dialog: MatDialog,
    private comun: ComunesService,

    private globals: Globals,
    private service: MonitorArchivosDuplicadosService,
    private router: Router,
  ) {
    this.datos = new DatosRequest();
    this.datos.fechaInicial = new UntypedFormControl(new Date().toISOString()).toString();
    this.datos.fechaFinal = new UntypedFormControl(new Date().toISOString()).toString();
  }

  listSelect: any[] = [];
  nombreArch: string;
  fechaInicial: string;
  fechaFinal: string;
  datos: DatosRequest;
  dataTable: any = [];
  showDataTable: any = [];
  banderaHasRows: boolean = false;
  page: number = 0;
  totalElements: number = 0;
  rowsPorPagina: number = 10;
  resp = '';

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {

    this.clickSuscliption = this.comun.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.getListProducts();

        const flag = this.getLocalStorage('regresa')
        const tmpData = this.getLocalStorage('monArchDupQuery')

        if (flag) {
          this.datos = tmpData;
          this.saveLocalStorage('regresa', null)
          this.saveLocalStorage('monArchDupQuery', null);
          this.consultar();
        } else {
          this.cleand();
          this.datos.producto = "0";
          this.datos.fechaInicial = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
          this.datos.fechaFinal = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
        }

      }
    });

  }


  ngOnDestroy(): void {
    const tmpData = this.getLocalStorage('regresa')

    if (!tmpData) {
      this.saveLocalStorage('monArchDupQuery', null);
    }
  }


  async getListProducts() {
    try {
      await this.service.getListProducts().then(async (resp: any) => {
        const { productos = [] } = resp;
        this.listSelect = productos;
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch (error) {
      this.showDialog('monitor.errorMsg.Err001.Mensaje', 'monitor.errorMsg.encabezadoError',
        'monitor.errorMsg.Err001.Sugerencia', 'error', 'monitor.errorMsg.Err001.codigo');
      this.globals.loaderSubscripcion.emit(false);
    }
  }
  async consultar(): Promise<void> {
    if(!this.validarCampos()) {
      this.cleand();
      console.log('entró');
      return
    };
    const fechaIni = isDate(this.datos.fechaInicial) ? this.datos.fechaInicial : parse(this.datos.fechaInicial, 'dd/MM/yyyy', new Date());
    const fechaFin = isDate(this.datos.fechaFinal) ? this.datos.fechaFinal: parse(this.datos.fechaFinal, 'dd/MM/yyyy', new Date());
    if (fechaIni > fechaFin) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
          this.translate.instant('pantalla.graficaBuzon.validacion.fechas.Observacion'),
          'alert'
        ),
      });
      return;
    }
    this.page = 0;
    if (!this.datos.fechaInicial.toString().includes('/')) {
      this.datos.fechaInicial = this.datePipe.transform(new Date(this.datos.fechaInicial), 'dd/MM/yyyy') || '';
    }
    if (!this.datos.fechaFinal.toString().includes('/')) {
      this.datos.fechaFinal = this.datePipe.transform(new Date(this.datos.fechaFinal), 'dd/MM/yyyy') || '';
    }
    const { codigoCliente = "", numContrato = "", idProducto = '0', nombreArchivo = "", fechaFinal, fechaInicial } = this.datos;

    const request = {
      buc: codigoCliente,
      contrato: numContrato,
      idProducto: idProducto,
      nombreArchivo: nombreArchivo,
      fechaInicial,
      fechaFinal
    }
    this.saveLocalStorage('monArchDupQuery', this.datos)
    const { content } = await this.service.consultar(request);
    this.dataTable = content.length > 0 ? content : [];
    this.showDataTable = this.dataTable.slice(0, this.rowsPorPagina);

    this.totalElements = this.dataTable.length;
    if (this.totalElements == 0) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('solicitudEstadosCuenta.msjINF002Titulo'),
          this.translate.instant('monitor.Inf01.mensaje'),
          'info',
          '',
          ''
        ),
      });
    }

    this.globals.loaderSubscripcion.emit(false);
  }

  limpiarEspacios(e: any) {
    const fileName = this.datos.nombreArchivo.trim()
    this.datos.nombreArchivo = fileName
  }

  async exportar() {
    var resp = "";
    const ext = "xls";
    // const resp = await this.service.getFile(this.datos, 'xls', this.page, this.rowsPorPagina).catch((e) => {
    //   return null;
    // });
    this.datos.pagina = this.page - 1;
    this.datos.tamanioPagina = this.rowsPorPagina;
    this.datos.extension = ext;
    const formVal = this.datos as DatosRequest;
    this.service.getFiles(formVal).then((res : any) => {
        resp = res;
    }).catch(() => {
      this.globals.loaderSubscripcion.emit(false);
    });
    this.globals.loaderSubscripcion.emit(false);


    if (!resp) {
      return this.openGeneralError();
    }
    const { listaArchivosConverted } : any = resp;
    const { srcfile, nameFile } = listaArchivosConverted[0];

    const auxText = nameFile.split('.')

    const dataConvert = {
      data: srcfile,
      type: auxText[1],
      name: nameFile
    }
    /** Se manda la informacion para realizar la descarga del archivo */
    this.fc.convertBase64ToDownloadFileInExport(dataConvert);
    return;
  }

  cleand() {
    this.dataTable = [];
    this.showDataTable = [];
    this.datos = new DatosRequest();
    this.datos.producto = '0';
    this.datos.fechaInicial = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    this.datos.fechaFinal = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    this.nombreArch = "";
    this.fechaInicial = "";
    this.fechaFinal = "";
    this.saveLocalStorage('monArchDupQuery', null)
  }

  validarCampos() {
    try {
      if (this.datos?.numContrato && this.datos?.numContrato?.length !== 12) {
        console.log('this.datos?.numContrato?.length', this.datos?.numContrato?.length);
        this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(
            'Error',
            ``,
            'error',
            '',
            this.translate.instant('monitor.validacion.val002')
          ),
        });
        return false;
      }
      //Delete validation for nombreArchivo because it was move to input property
      return true;  
    } catch (error) {
      console.log('e', error);
      return false
    }
  }

  showDialog(titulo: string, observacion: string, sugerencia: string, tipo: any, codigo: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant(titulo),
        this.translate.instant(observacion),
        tipo,
        this.translate.instant(codigo),
        this.translate.instant(sugerencia)
      ),
    });
  }

  openGeneralError() {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      ),
    });
  }

  /**
     * Metodo para solo ingrese numeros
     * en el input de numero de contrato
     */
  eventOnlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * @description Metodo para poder crear la fecha maxima
   */
  getMinDate() {
    let fecha = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1) + 6);
    date.setFullYear(Number(partsDate[2]) - 4);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }


  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  onPagChanged(event: any) {
    const pg = event.page - 1;
    this.page = pg;
    const startItem = pg * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.showDataTable = this.dataTable.slice(startItem, endItem);
  }

  async getDetail(data: any) {
    if (!data.nombreArchivoProcesado || data.nombreArchivoProcesado == '') {
      return;
    }
    this.saveLocalStorage('archivo', data);
    const { buc, cliente } = data;
    const tracking: any = {
      "codCliente": buc,
      "cliente": cliente,
      "estatus": 1
    }
    this.saveLocalStorage('traking', tracking);
    this.saveLocalStorage('archDupPage', true);
    this.saveLocalStorage('regresa', true);
    this.router.navigate(['/monitoreo/consultaTracking/consultaArchivo']);

  }

  saveLocalStorage(key: string | number, data: any) {
    localStorage.setItem(`${key}`, JSON.stringify(data));
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  sumarOperaciones() {
    let count = 0;
    this.showDataTable.map((data: any) => {
      count += data.totalOperaciones
    })
    return count;
  }

  sumarMontos() {
    let count = 0;
    this.showDataTable.map((data: any) => {
      count += data.monto
    })
    return count;
  }

  rechazo = false;
  idTmpArch = '';
  tmpName = '';
  motivoRechazo = '';
  async procesar(flag: boolean, name?: string, idArchivo?: string) {
    let idRequest: any = !flag ? this.idTmpArch : idArchivo;
    await this.service.setMotivoRechazo(idRequest, this.motivoRechazo).then(async (resp: any) => {
      this.resp = resp.codError;
    });
    this.globals.loaderSubscripcion.emit(false);
    this.cancelar();
    if (this.resp != 'COD01') {
      return this.openGeneralError()
    }

    const txt = this.motivoRechazo != '' ? 'monitorArchivoOperaciones.nivelProducto.rechazado' : 'monitorArchivoOperaciones.nivelProducto.procesado';
    const nameFile = this.tmpName != '' ? this.tmpName : name;
    return this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
        `${this.translate.instant(txt)}: ${nameFile}`,
        'info',
        '',
        this.translate.instant('pantalla.envio.archivos.seccion.archivo')
      ),
    });
  }

  activarRechazo(idArchivo: string, name: string) {
    this.idTmpArch = idArchivo;
    this.tmpName = name;
    this.rechazo = true;
  }

  cancelar() {
    this.idTmpArch = ''
    this.motivoRechazo = ''
    this.rechazo = false;
  }

}
