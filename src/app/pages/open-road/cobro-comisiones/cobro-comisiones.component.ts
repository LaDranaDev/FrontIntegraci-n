import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ConfirmacionAnularComisionComponent } from 'src/app/components/modals/confirmacion-anular-comision/confirmacion-anular-comision.component';
import { ModalCuentaCobroComponent } from 'src/app/components/modals/modal-cuenta-cobro/modal-cuenta-cobro.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConsultasComisionesService } from 'src/app/services/consultas-comisiones.service';


@Component({
  selector: 'app-cobro-comisiones',
  templateUrl: './cobro-comisiones.component.html',
  styleUrls: ['./cobro-comisiones.component.css']
})
export class CobroComisionesComponent implements OnInit {
  public activeLang = 'es';
  consultas: any[] = [];
  page: number = 1;
  pageSize: number = 20;
  totalRegistros: number = 0;
  parametros: any;
  formConsulta: any;
  total: any;
  totalComision: any;
  totalComisionDivisa: any;
  totalIva: any;
  tablaDatos: Boolean = false;
  array: any[] = [];
  titulosCabecera: any[] = ['Código de Cliente',
    'Cuenta de Cobro', 'Concepto', 'Producto',
    'No. de Operaciones por Producto',
    'Clacon', 'Fecha Cálculo',
    'Fecha Envío', 'Fecha Cambio Estatus', 'Error',
    'Estatus', 'Importe', 'Precio', '% Millar',
    'Comisión', 'Tipo Cambio Pesos', 'Divisa',
    'Comisión Divisa', 'IVA Comisión Divisa', 'Total Comisión Divisa', 'Alias Subsidiaria', 'Buc Subsidiaria'];
  prue: any[];

  get consultaComision(): UntypedFormArray {
    return this.formConsulta.get("anulaComision") as UntypedFormArray
  }

  constructor(
    public translate: TranslateService,
    private service: ConsultasComisionesService,
    private fb: UntypedFormBuilder,
    private globals: Globals,
    private comunService: ComunesService,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  clickSuscliption: Subscription | undefined;
  ngOnInit(): void {

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.array = []
        this.tablaDatos = false
        this.formConsulta = new UntypedFormGroup({
          anulaComision: new UntypedFormArray([])
        });
      }
    });

  }

  creaItem(item: any) {
    this.formConsulta.get('anulaComision').push(new UntypedFormGroup(
      {
        bucCliente: new UntypedFormControl(item.bucCliente || ''),
        bucSubsidiaria: new UntypedFormControl(item.bucSubsidiaria),
        aliasSubsidiaria: new UntypedFormControl(item.aliasSubsidiaria),
        ctaOrdenante: new UntypedFormControl(item.ctaOrdenante),
        concepto: new UntypedFormControl(item.concepto),
        descProducto: new UntypedFormControl(item.descProducto),
        numRegistrosProducto: new UntypedFormControl(item.numRegistrosProducto),
        clacon: new UntypedFormControl(item.clacon),
        fechaCalculo: new UntypedFormControl(item.fechaCalculo),
        fechaEnvio: new UntypedFormControl(item.fechaEnvio),
        fechaCambioEstatus: new UntypedFormControl(item.fechaCambioEstatus),
        descError: new UntypedFormControl(item.descError),
        descEstatus: new UntypedFormControl(item.descEstatus),
        strImporte: new UntypedFormControl(item.strImporte),
        strPrecio: new UntypedFormControl(item.strPrecio),
        strPorcentaje: new UntypedFormControl(item.strPorcentaje),
        strComision: new UntypedFormControl(item.strComision),
        strTcPesos: new UntypedFormControl(item.strTcPesos),
        divisa: new UntypedFormControl(item.divisa),
        strComisionDivisa: new UntypedFormControl(item.strComisionDivisa),
        strIva: new UntypedFormControl(item.strIva),
        strTotal: new UntypedFormControl(item.strTotal),
        estatus: new UntypedFormControl({ value: false, disabled: item.idEstatus != 46 ? true : false }),
        idDetalle: new UntypedFormControl(item.idDetalle)
      })
    )
  }

  consultaComisiones(parametros: any) {
    this.service.consultaComisiones(parametros).then((data: any) => {
      if (data.code == 200) {
        const { data: consulta, total, totalComision, totalComisionDivisa, totalIva, totalPaginas, totalRegistros } = data.result;
        this.consultas = consulta;
        this.total = total;
        this.totalComision = totalComision;
        this.totalComisionDivisa = totalComisionDivisa;
        this.totalIva = totalIva;
        this.totalRegistros = totalRegistros;

        if (consulta != null && this.totalRegistros > 0) {
          for (let i = 0; i < consulta.length; i++) {
            const element = consulta[i];
            this.creaItem(element)
            this.globals.loaderSubscripcion.emit(false);
          }
        } else {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('EC'),
            this.translate.instant('reportes.exception.mensaje'),
            'error',
            'ERRBD004',
            '');
        }

      }
    });
  }

  seleccionado(dato: any, i: any, event: any) {
    if (event.target.checked === true) {
      dato.id = i
      this.array.push(dato)
    } else {
      this.array = this.array.filter(
        (ele: any) => {
          return ele['id'] != i
        }
      )
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


  onPageChange(pageNum: any) {
    this.formConsulta.reset();
    this.consultaComision.clear();
    this.parametros = (this.parametros == undefined) ? {} : this.parametros;
    this.parametros.page = pageNum;
    this.consultaComisiones(this.parametros);
  }

  filtroConsulta(data: any) {
    this.formConsulta.reset();
    this.consultaComision.clear();
    this.parametros = data;
    if (!data.clean) {
      this.consultaComisiones(this.parametros);
    } else {
      this.consultas = [];
      this.total = 0;
      this.totalComision = 0;
      this.totalComisionDivisa = 0;
      this.totalIva = 0;
      this.totalRegistros = 0;
    }
  }

  SeLimpia(data: any): void {
    this.tablaDatos = data;
  }

  estatusComision(): void {
    if (this.array.length === 0) {
      this.open(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE06Titulo'),
        this.translate.instant('unRegistro'),
        'error',
        'ERROR00005',
        '');
      return
    }

    const titulo = 'Confirmar'
    const contenido = 'Confirmación'
    const conf = this.dialog.open(ConfirmacionAnularComisionComponent, {
      data: new ModalInfoBeanCorreoComponents(titulo, contenido, this.array), hasBackdrop: true
    })

    conf.afterClosed().subscribe(async (r: { success: boolean }) => {
      r.success ? this.filtroConsulta(this.parametros) : null;
    })

  }
  cuentaCobro() {
    if (this.array.length === 0) {
      this.open(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE06Titulo'),
        this.translate.instant('unRegistro1'),
        'error',
        'ERROR00005',
        '');
      return
    }
    if (this.array.length > 1) {
      this.open(
        this.translate.instant('noPermitida'),
        this.translate.instant('unRegistro2'),
        'error',
        'ERROR00005',
        '');
      return
    }
    const titulo = 'Aviso'
    const contenido = 'Ingrese la Nueva Cuenta de Cobro:'
    const cfm = this.dialog.open(ModalCuentaCobroComponent, {
      data: new ModalInfoBeanCorreoComponents(titulo, contenido, this.array[0]), hasBackdrop: true
    });
    cfm.afterClosed().subscribe((t) => t.success ? this.filtroConsulta(this.parametros) : null)
  }


  exportar() {
    this.descargarArchivo('xlsx');
  }

  // Iniciamos la exportacion de datos
  descargarArchivo(tipoArchivo: any) {
    const user = localStorage.getItem('UserID') || 'Sin información';
    this.service.reporteComisiones(user, tipoArchivo, this.parametros).then(response =>
      this.fc.convertBase64ToDownloadFileInExport({
        data: response?.result?.content,
        name: response?.result?.nombre
      })
    ).finally(() =>
      this.globals.loaderSubscripcion.emit(false)
    );
  }

  selectAll(event: any): void {
    const add = event?.target.checked;
    const checkItems = document.getElementsByName("estatus");
    checkItems.forEach((r: any, index) => {
      const valueItem = this.formConsulta.get('anulaComision').value[index]
      if (add) {
        if (!r.disabled) {
          r.checked = true
          valueItem.estatus = true;
          const e = { target: { checked: true } }
          this.seleccionado(r, index, e);
        } else {

        }
      } else {
        r.checked = false;
        valueItem.estatus = false;
        this.array = [];
      }
    })
  }

}
