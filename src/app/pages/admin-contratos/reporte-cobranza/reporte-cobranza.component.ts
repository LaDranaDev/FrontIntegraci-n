import { formatDate } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { CanalesBeanComponents } from '../../../bean/canales-bean.component';
import { ClaconesBeanComponents } from '../../../bean/clacones-bean.component';
import { ConfigRepCobCtaBeanComponents } from '../../../bean/config-repcob-cuenta-bean.component';
import { CuentasBeanComponents } from '../../../bean/cuentas-bean.component';
import { DatosCuentaBeanComponent } from '../../../bean/datos-cuenta-bean.component';
import { GeneraXMLBeanComponent } from '../../../bean/datos-xml-bean.component';
import { FormatosBeanComponents } from '../../../bean/formatos-bean.components.';
import { HorasBeanComponents } from '../../../bean/horas-bean.component';
import {
  ContratosService,
  Contrato,
} from '../../../services/admin-contratos/contratos.service';
import { Globals } from '../../../bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reporte-cobranza',
  templateUrl: './reporte-cobranza.component.html',
  styleUrls: ['./reporte-cobranza.component.css']
})
export class ReporteCobranzaComponent implements OnInit, OnDestroy {
  @ViewChild('limpiar') limp: any;

  public activeLang = 'es';
  closeResult = '';
  formDatosPersonales: UntypedFormGroup = new UntypedFormGroup({});
  tipRep = [
    { id: '0', valor: 'Seleccione' },
    { id: '1', valor: 'INTRADIA' },
    { id: '2', valor: 'CONSOLIDADO' },
  ];
  serializedDate = new Date().toISOString();
  btnRegenera: boolean = true;
  bolFecha: boolean = true;
  canal: number = 0;
  tipForm: number = 0;
  frec: string = '';
  fecha: string = new UntypedFormControl(new Date().toISOString()).toString();
  horario: string = '';
  radioConso: boolean = false;
  radioCta: boolean = false;
  radioPar: boolean = false;
  radioAcu: boolean = false;
  optionTipRep: string = '0';
  cuentasRepCob: CuentasBeanComponents[] = [];
  claconesRepCob: ClaconesBeanComponents[] = [];
  claconesConfigRepCob: ClaconesBeanComponents[] = [];
  canalesBean: CanalesBeanComponents[] = [];
  formatosBean: FormatosBeanComponents[] = [];
  horasBean: HorasBeanComponents[] = [];
  datospersonales: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };
  configRepCob: ConfigRepCobCtaBeanComponents = {
    intradia: false,
    intradiaCierre: false,
    consolidadoxDia: false,
    recibirArchivo: '',
    tipoContenido: '',
    canal: '',
    formato: '',
    formatoConsolidado: '',
    bandCierre: false,
    todosClaconesAbono: false,
    todosClaconesCargo: false,
    bandCobranzaSig: '',
    bandCobranzaCvrt: '',
    bandAnulaciones: '',
  };
  mapValores: Map<string, any> = new Map();
  datos: any;

  constructor(
    public translate: TranslateService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private service: ContratosService,
    private serviceComun: ComunesService,
    private globals: Globals,
    private fb: UntypedFormBuilder,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    public dialog: MatDialog
  ) {
    this.translate.setDefaultLang(this.activeLang);
    config.backdrop = 'static';
    config.keyboard = false;
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    //this.initForm();

    this.clickSuscliption = this.serviceComun.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 22) {
        this.initForm();
      }
    });
  }

  initForm() {
    this.datos = this.serviceComun.datosContrato;
    if (this.datos !== undefined) {
      this.datospersonales.bucCliente = this.datos.bucCliente;
      this.obtenDatosContrato();
    }
    this.formDatosPersonales = this.fb.group({
      fecha: [''],
      tipoReporte: [''],
      selHorario: [''],
      opCierre: [''],
      canalEntrega: [''],
      tipoFormato: [''],
      claconesCargo: [''],
      claconesAbono: [''],
      consoCtas: [''],
      sigNegativos: [''],
      contenido: [''],
      virtMov: [''],
      idContrato: [''],
    });
    this.inhabilita();

    if (this.datos.descEstatus === 'ACTIVO') {
      this.formDatosPersonales.disable();
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  obtenDatosContrato() {
    this.limpiarContenido();
    if (this.datospersonales.bucCliente != '') {
      this.service
        .obtDatCta(this.datospersonales.bucCliente)
        .then((resp: any) => {
          if (resp.status == 'OK00000') {
            this.datospersonales.bucCliente = resp.result.bucCliente;
            this.datospersonales.cuentaEje = resp.result.cuentaEje;
            this.datospersonales.numContrato = resp.result.numContrato;
            this.datospersonales.razonSocial = resp.result.razonSocial;
            this.datospersonales.descEstatus = resp.result.descEstatus;
            this.datospersonales.idContrato = resp.result.idContrato;
            if (this.datospersonales.descEstatus !== 'CANCELADO') {

              this.formDatosPersonales.get('tipoReporte')?.enable();
            }
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.limpiar();
            this.globals.loaderSubscripcion.emit(false);
            this.open('Error', this.translate.instant('regeneraReporteCobranza.msgGENERR001'), 'error');
          }
        }).catch(() => {
          this.globals.loaderSubscripcion.emit(false);
          this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
              this.translate.instant('modal.msjERRGEN0001Titulo'),
              this.translate.instant('modal.msjERRGEN0001Observacion'),
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              this.translate.instant('modal.msjERRGEN0001Sugerencia')
            ),
          });
        });
    } else {
      this.open('Error', this.translate.instant('regeneraReporteCobranza.msgGENERR002'), 'error');
      this.formDatosPersonales.get('tipoReporte')?.disable();
      this.optionTipRep = '0';
      this.limpiar();
    }
  }

  async obtenConfigRep() {
    this.frec =
      this.formDatosPersonales.get('tipoReporte')?.value == '1' ? '7' : '8';
    await this.service
      .obtenerDatos(this.datospersonales.idContrato, this.frec)
      .then(async (response: any) => {
        if (response.status == 'OK00000') {
          this.cuentasRepCob = response.result.listCuentas;
          this.claconesRepCob = response.result.catClacones;
          this.claconesConfigRepCob = response.result.listConfigClacones;
          for (var i in this.claconesRepCob) {
            for (var e in this.claconesConfigRepCob) {
              if (
                this.claconesRepCob[i].idCatalogo ==
                this.claconesConfigRepCob[e].idCatalogo
              ) {
                delete this.claconesRepCob[i];
              }
            }
          }
          this.configRepCob.recibirArchivo =
            response.result.config.recibirArchivo;
          if (response.result.config.recibirArchivo == 'C') {
            this.radioCta = true;
          } else if (response.result.config.recibirArchivo == 'A') {
            this.radioConso = true;
          }
          this.configRepCob.tipoContenido =
            response.result.config.tipoContenido;
          if (response.result.config.tipoContenido == 'P') {
            this.radioPar = true;
          } else if (response.result.config.tipoContenido == 'A') {
            this.radioAcu = true;
          }
          this.configRepCob.todosClaconesCargo =
            response.result.config.todosClaconesCargo;
          this.configRepCob.todosClaconesAbono =
            response.result.config.todosClaconesAbono;
          this.configRepCob.bandCobranzaSig =
            response.result.configBanCob.bandCobranzaSig === ' ' ||
              response.result.configBanCob.bandCobranzaSig === 'I'
              ? ''
              : response.result.configBanCob.bandCobranzaSig;
          this.configRepCob.bandCobranzaCvrt =
            response.result.configBanCob.bandCobranzaCvrt === ' ' ||
              response.result.configBanCob.bandCobranzaCvrt === 'I'
              ? ''
              : response.result.configBanCob.bandCobranzaCvrt;
          this.configRepCob.bandAnulaciones =
            response.result.configBanCob.bandAnulaciones === ' ' ||
              response.result.configBanCob.bandAnulaciones === 'I'
              ? ''
              : response.result.configBanCob.bandAnulaciones;
          this.configRepCob.bandCierre = response.result.config.bandCierre;
          this.canal = +response.result.config.canal;
          this.tipForm = +response.result.config.formato;
          this.canalesBean = response.result.listCanal;
          this.formatosBean = response.result.listFormatos;
          this.horasBean = response.result.listHorasConfig;
          if (this.frec != '8') {
            this.horario =
              response.result.listHorasConfig[0].descripcionCatalogo;
          }
          this.habilita();
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.globals.loaderSubscripcion.emit(false);
          this.limpiaCombo();
          this.open(
            'Error',
            this.translate.instant('regeneraReporteCobranza.configReport'),
            'error'
          );
        }
      });
  }

  onChange(event: any) {
    let idF = this.formDatosPersonales.get('tipoReporte')?.value;
    if (idF === '0') {
      this.btnRegenera = true;
      this.bolFecha = true;
      this.limpiaCombo();
    } else {
      let val = event.target.value[0];
      this.optionTipRep = val;
      if (this.datospersonales.bucCliente != '') {
        this.obtenConfigRep();
      } else {
        this.open('Error', this.translate.instant('regeneraReporteCobranza.msgGENERR002'), 'error');
      }
    }
  }

  generaXML() {
    this.globals.loaderSubscripcion.emit(true);
    var tipRep = this.formDatosPersonales.get('tipoReporte')?.value;
    var canl = this.formDatosPersonales.get('canalEntrega')?.value;
    var fmt = this.formDatosPersonales.get('tipoFormato')?.value;
    if (tipRep === '1' && canl === 3 && fmt !== 65) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        'Cuando el Canal de Entrega es Swift FIN Solo se Puede Asignar el Tipo de Formato REPORTE COBRANZA MT942'
      );
    } else if (canl === 6 && fmt !== 80) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        'Cuando el Canal de Entrega es REPAL Solo se Pueden Asignar el Tipo de Formato REPORTE COBRANZA TXT ENRIQUECIDO'
      );
    } else if (tipRep === '2' && canl === 3 && fmt !== 64 && fmt !== 60) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        'Cuando el Canal de Entrega es Swift FIN Solo se Pueden Asignar el Tipo de Formato REPORTE COBRANZA MT940'
      );
    } else {
      this.generaDocumento();
    }
  }

  generaDocumento() {
    this.globals.loaderSubscripcion.emit(true);
    var date = this.formDatosPersonales.get('fecha')?.value;
    var fechaSeleccionada = formatDate(date, 'yyyy-MM-dd', 'en-MX');
    var d = new Date();
    var fechaDia = formatDate(d, 'yyyy-MM-dd', 'en-MX');
    d.setDate(d.getDate() - 90);
    var fechPermitifa = formatDate(d, 'yyyy-MM-dd', 'en-MX');
    if (fechaSeleccionada < fechPermitifa || fechaSeleccionada > fechaDia) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        'No es posible re-generar reportes de cobranza con vigencia mayor a 90 días hacia atras de la fecha seleccionada o fecha mayor a la fecha actual'
      );
    } else {
      let fecha = formatDate(date, 'yyyy-MM-dd', 'en-MX') + ' 00:00:00';
      var ctas = [];
      for (let c in this.cuentasRepCob) {
        ctas.push(this.cuentasRepCob[c].numCuenta);
      }
      let hora =
        this.formDatosPersonales.get('tipoReporte')?.value == '1'
          ? this.formDatosPersonales.get('selHorario')?.value.replace(':', '')
          : 2115;
      const request: GeneraXMLBeanComponent = {
        idcnrlrepcob: '',
        idcntr: this.formDatosPersonales.get('idContrato')?.value,
        ctas: ctas,
        idlay: this.formDatosPersonales.get('tipoFormato')?.value,
        bandacum: this.formDatosPersonales.get('contenido')?.value,
        contrepcob: this.formDatosPersonales.get('consoCtas')?.value,
        fechreg: fecha,
        horacort: hora,
        idfrec:
          this.formDatosPersonales.get('tipoReporte')?.value == '1' ? '7' : '8',
        idcatestatus: '85',
        tabla: 'C',
        idcanl: this.formDatosPersonales.get('canalEntrega')?.value,
        flgcont: 'A',
        claconescargo:
          this.formDatosPersonales.get('claconesCargo')?.value.toString() ==
            '' || this.formDatosPersonales.get('claconesCargo')?.value == true
            ? 'D'
            : 'I',
        claconesabono:
          this.formDatosPersonales.get('claconesAbono')?.value.toString() ==
            '' || this.formDatosPersonales.get('claconesAbono')?.value == true
            ? 'H'
            : 'I',
        flgh2hrepcobsig:
          this.formDatosPersonales.get('sigNegativos')?.value.toString() ==
            '' || this.formDatosPersonales.get('sigNegativos')?.value == true
            ? 'A'
            : 'I',
        flgh2hrepcobcvr:
          this.formDatosPersonales.get('virtMov')?.value.toString() == '' ||
            this.formDatosPersonales.get('virtMov')?.value == true
            ? 'A'
            : 'I',
      };
      const data = JSON.stringify(request);
      this.service.generaXML(data).then((response: any) => {
        if (response.status == 'OK00000') {
          this.globals.loaderSubscripcion.emit(false);
          this.reiniciar();
          this.bolFecha = true;
          this.btnRegenera = true;
          this.open('', 'Se realizo con exito la regeneración del Reporte');
        } else {
          this.reiniciar();
          this.bolFecha = true;
          this.btnRegenera = true;
          this.globals.loaderSubscripcion.emit(false);
          this.open('Error', 'Ocurrio un error: ' + response.result);
        }
      });
    }
  }

  limpiar() {
    this.datospersonales = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    this.cuentasRepCob = [];
    this.claconesRepCob = [];
    this.claconesConfigRepCob = [];
    this.configRepCob = {
      intradia: false,
      intradiaCierre: false,
      consolidadoxDia: false,
      recibirArchivo: '',
      tipoContenido: '',
      canal: '',
      formato: '',
      formatoConsolidado: '',
      bandCierre: false,
      todosClaconesAbono: false,
      todosClaconesCargo: false,
      bandCobranzaSig: '',
      bandCobranzaCvrt: '',
      bandAnulaciones: '',
    };
    this.canal = 0;
    this.tipForm = 0;
    this.horario = '';
  }

  limpiaCombo() {
    this.btnRegenera = true;
    this.bolFecha = true;
    this.cuentasRepCob = [];
    this.claconesRepCob = [];
    this.claconesConfigRepCob = [];
    this.configRepCob = {
      intradia: false,
      intradiaCierre: false,
      consolidadoxDia: false,
      recibirArchivo: '',
      tipoContenido: '',
      canal: '',
      formato: '',
      formatoConsolidado: '',
      bandCierre: false,
      todosClaconesAbono: false,
      todosClaconesCargo: false,
      bandCobranzaSig: '',
      bandCobranzaCvrt: '',
      bandAnulaciones: '',
    };
    this.canal = 0;
    this.tipForm = 0;
    this.horario = '';

    this.inhabilitaConte();
    this.formDatosPersonales = this.fb.group({
      fecha: [new Date().toISOString()],
      tipoReporte: ['0'],
      selHorario: [''],
      opCierre: [''],
      canalEntrega: [''],
      tipoFormato: [''],
      claconesCargo: [''],
      claconesAbono: [''],
      consoCtas: [''],
      sigNegativos: [''],
      contenido: [''],
      virtMov: [''],
      idContrato: [''],
    });
  }

  limpiarContenido() {
    this.btnRegenera = true;
    this.bolFecha = true;
    this.cuentasRepCob = [];
    this.claconesRepCob = [];
    this.claconesConfigRepCob = [];
    this.configRepCob = {
      intradia: false,
      intradiaCierre: false,
      consolidadoxDia: false,
      recibirArchivo: '',
      tipoContenido: '',
      canal: '',
      formato: '',
      formatoConsolidado: '',
      bandCierre: false,
      todosClaconesAbono: false,
      todosClaconesCargo: false,
      bandCobranzaSig: '',
      bandCobranzaCvrt: '',
      bandAnulaciones: '',
    };
    this.canal = 0;
    this.tipForm = 0;
    this.horario = '';

    this.inhabilita();
    this.formDatosPersonales = this.fb.group({
      fecha: [new Date().toISOString()],
      tipoReporte: ['0'],
      selHorario: [''],
      opCierre: [''],
      canalEntrega: [''],
      tipoFormato: [''],
      claconesCargo: [''],
      claconesAbono: [''],
      consoCtas: [''],
      sigNegativos: [''],
      contenido: [''],
      virtMov: [''],
      idContrato: [''],
    });
  }

  reiniciar() {
    this.limpiar();
    this.inhabilita();
    this.formDatosPersonales = this.fb.group({
      fecha: [new Date().toISOString()],
      tipoReporte: ['0'],
      selHorario: [''],
      opCierre: [''],
      canalEntrega: [''],
      tipoFormato: [''],
      claconesCargo: [''],
      claconesAbono: [''],
      consoCtas: [''],
      sigNegativos: [''],
      contenido: [''],
      virtMov: [''],
      idContrato: [''],
    });
  }

  inhabilita() {
    this.formDatosPersonales.get('tipoReporte')?.disable();
    this.formDatosPersonales.get('selHorario')?.disable();
    this.formDatosPersonales.get('opCierre')?.disable();
    this.formDatosPersonales.get('canalEntrega')?.disable();
    this.formDatosPersonales.get('tipoFormato')?.disable();
    this.formDatosPersonales.get('claconesCargo')?.disable();
    this.formDatosPersonales.get('claconesAbono')?.disable();
    this.formDatosPersonales.get('consoCtas')?.disable();
    this.formDatosPersonales.get('archCta')?.disable();
    this.formDatosPersonales.get('sigNegativos')?.disable();
    this.formDatosPersonales.get('contenido')?.disable();
    this.formDatosPersonales.get('virtMov')?.disable();
  }

  inhabilitaConte() {
    this.formDatosPersonales.get('selHorario')?.disable();
    this.formDatosPersonales.get('opCierre')?.disable();
    this.formDatosPersonales.get('canalEntrega')?.disable();
    this.formDatosPersonales.get('tipoFormato')?.disable();
    this.formDatosPersonales.get('claconesCargo')?.disable();
    this.formDatosPersonales.get('claconesAbono')?.disable();
    this.formDatosPersonales.get('consoCtas')?.disable();
    this.formDatosPersonales.get('archCta')?.disable();
    this.formDatosPersonales.get('sigNegativos')?.disable();
    this.formDatosPersonales.get('contenido')?.disable();
    this.formDatosPersonales.get('virtMov')?.disable();
  }

  habilita() {
    this.formDatosPersonales.get('tipoReporte')?.enable();
    this.formDatosPersonales.get('selHorario')?.enable();
    this.formDatosPersonales.get('opCierre')?.enable();
    this.formDatosPersonales.get('canalEntrega')?.enable();
    this.formDatosPersonales.get('tipoFormato')?.enable();
    this.formDatosPersonales.get('claconesCargo')?.enable();
    this.formDatosPersonales.get('claconesAbono')?.enable();
    this.formDatosPersonales.get('consoCtas')?.enable();
    this.formDatosPersonales.get('archCta')?.enable();
    this.formDatosPersonales.get('sigNegativos')?.enable();
    this.formDatosPersonales.get('contenido')?.enable();
    this.formDatosPersonales.get('virtMov')?.enable();
    this.bolFecha = false;
    this.btnRegenera = false;
  }

  open(
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
    });
  }
}
