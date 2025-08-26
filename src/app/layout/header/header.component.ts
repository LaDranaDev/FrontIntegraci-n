import { AfterViewChecked, Input, OnInit, ViewChild } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatSidenav } from '@angular/material/sidenav';
import { ComunesService } from '../../services/comunes.service';
import { Globals } from '../../bean/globals-bean.component';
import { Router } from '@angular/router';
import { parametrosService } from 'src/app/services/contingencia/parametros.service';
import { MemoryService } from 'src/app/services/memory.service';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';
import { TimerSessionService } from 'src/app/services/timer-session.service';
import { GestionAlarmaService } from 'src/app/services/administracion/gestion-alarma.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  controlActions: any;
  isExpanded = true;
  isShowing = false;
  isExpanded2 = true;
  isShowing2 = false;
  showSubmenu: boolean = false;
  pintarContrato: any = 'MENU_CONTRATOS';
  pintarAltaContrato: any = 'CNTR_CONTRATOS';
  pintarConsultaContratoUsuario: any = 'CNTR_CONSULTA_USUARIO';
  pintarConsultaUsuario: any = 'CNTR_CONSULTA_CONTRATO';
  pintarProducto: any = 'CNTR_PRODUCTOS';
  pintarCuentasOrdenantes: any = 'CNTR_CTA_ORDENANTES'
  pintarUsuariosOperantes: any = 'CNTR_USUARIOS_OPER'
  pintarReporteCobranza: any = 'CNTR_COBRANZA'
  pintarNotificaciones: any = 'CNTR_NOTIFICACIONES'
  pintarParametros: any = 'CNTR_PARAMETROS'
  pintarEstadoCuenta: any = 'CNTR_EDO_CUENTA'
  pintarEsquemaComision: any = 'CNTR_ESQ_COMISION'
  pintarCobroComision: any = 'CNTR_COBR_COMISION'
  pintarCuentasBeneficiarias: any = 'CNTR_CTAS_BENEFICIARIAS'
  pintarConvenioContrato: any = 'H2H_CNTR_CONVENIO_CONTRATO'
  pintarContingencia: any = 'MENU_CONTINGENCIA'
  pintarEoCuenta: any = 'MENU_ESTADO_CUENTA'
  pintarBuzon: any = 'MENU_BUZON'
  pintarProtocolos: any = 'MENU_PROTOCOLOS'
  pintarCanales: any = 'MENU_CANALES'
  pintarDelContrato: any = 'MENU_CON_CONTRATO'

  pintarAdmin: any = 'MENU_ADMINISTRACION'
  pintarBackend: any = 'MENU_BACKEND'
  pintarBancos: any = 'MENU_BANCOS'
  pintarLayputs: any = 'MENU_LAYOUTS'
  pintarMNotificaciones: any = 'MENU_NOTIFICACIONES'
  pintarProdcutos: any = 'MENU_PRODUCTOS'
  pintarMensajeError: any = 'MENU_MENSAJES_ERROR'
  pintarCatDinamico: any = 'MENU_CAT_DINAMICO'
  pintarCancelOperaciones: any = 'MENU_CANCEL_OPER'

  pintarAdmonClient: any = 'MENU_ADMON_CLIENT'
  pintarApi: any = 'MENU_API_CIFRADO'
  pintarCertificado: any = 'MENU_ADMON_CERTIF'
  pintarAdBuzon: any = 'MENU_ADMON_BUZON'

  pintarMonitoreo: any = 'MENU_MONITOREO'
  pintarTrakingMNTR: any = 'MENU_TRCKNG_MNTR'
  pintarTraing: any = 'MENU_TRCKNG'
  pintarMonSaldos: any = 'MENU_MON_SALDOS'
  pintarMonitorOP: any = 'MENU_MONITOR_OP'


  pintarOperativo: any = 'MENU_OPERATIVO'
  pintarGraficaCliente: any = 'MENU_GRAFICA_CLIENTE'
  pintarGraficaEstatusCliente: any = 'MENU_GRAFICA_ESTATUS_CLIENTE'
  pintarGraficaEstatusClienteParam: any = 'MENU_GRAFICA_ESTATUS_CLIENTE_PARAM'
  pintarGraficaArchivoCliente: any = 'MENU_GRAFICA_ARCHIVOS_CLIENTE'
  pintarTotalOperacionesProductos: any = 'MENU_TOTAL_OPERACIONES_PRODUCTO'
  pintarTotalOperacionesCliente: any = 'MENU_TOTAL_OPERACIONES_CLIENTE'
  pintarConsolidadoOperaciones: any = 'MENU_CONSOLIDADOS_OPERACIONES'
  pintarConsolidados: any = 'MENU_CONSOLIDADOS'
  pintarConsolidadoCliente: any = 'MENU_CONSOLIDADOS_CLIENTE'

  pintarReportes: any = 'MENU_CONSUL_REPO'
  pintarCuentasBene: any = 'MENU_CTAS_BENEF'
  pintarComisiones: any = 'MENU_COMISIONES'

  pintarPistas: any = 'MENU_PISTAS'
  pintarBitacora: any = 'MENU_BITACORA'
  pintarReportes2: any = 'MENU_REPORTES'
  pintarReportesMas: any = 'MENU_REPOR_MAS'

  pintarGo: any = 'MENU_SUPERCTA_GO'

  //nuevo para monitoreo de apis  los ids deben coinicidr con los del backend nota
  pintarMonitoreoApi: any = 'MENU_MONITOREO_API';  
  pintarConsultaTrackingApi: any = 'MENU_TRCKNG_API';   
  pintarMonitorOperacionesApi: any = 'MENU_MONOP_API';   



  showSubSubMenu: boolean = false;
  showSubSubMenu2: boolean = false;
  showSubSubMenu3: boolean = false;
  showSubSubMenu4: boolean = false;
  showSubSubMenu5: boolean = false;
  showSubSubMenu6: boolean = false;
  showSubSubMenu7: boolean = false;
  showSubSubMenu8: boolean = false;
  showSubSubMenu9: boolean = false;
  showSubSubMenu10: boolean = false;
  showSubSubMenu11: boolean = false;
  showSubSubMenu12: boolean = false;
  showSubSubMenu13: boolean = false;
  showSubSubMenu14: boolean = false;
  showSubSubMenu15: boolean = false;
  showSubSubMenuMoniApi: boolean = false;  //nuevo  esta con el perfilamiento  para test en true
  items: string[] = [];
  items2: string[] = [];
  items3: string[] = [];
  items4: string[] = [];
  items5: string[] = [];
  items6: string[] = [];
  items7: string[] = [];
  items8: string[] = [];
  items9: string[] = [];
  items10: string[] = [];
  items11: string[] = [];
  items12: string[] = [];
  items13: string[] = [];
  items14: string[] = [];
  items15: string[] = [];
  items16: string[] = [];
  activeState: any;
  datosContrato: any = false;
  otro: any = false;
  acti: any = false;
  gesProAct1: boolean = false;
  gesProAct2: boolean = false;
  gesProAct3: boolean = false;
  gesProAct4: boolean = false;
  gesProAct5: boolean = false;
  adminContraAct1: boolean = false;
  adminContraAct2: boolean = false;
  adminContraAct3: boolean = false;
  adminContraAct4: boolean = false;
  adminContraAct5: boolean = false;
  adminContraAct6: boolean = false;
  adminContraAct7: boolean = false;
  adminContraAct8: boolean = false;
  adminContraAct9: boolean = false;
  adminContraAct10: boolean = false;
  adminContraAct11: boolean = false;
  adminContraAct12: boolean = false;
  adminContraAct13: boolean = false;
  adminContraAct14: boolean = false;
  adminContraAct15: boolean = false;
  adminContraAct16: boolean = false;
  adminContraAct17: boolean = false;
  adminContraAct18: boolean = false;
  adminContraAct19: boolean = false;
  adminContraAct20: boolean = false;
  adminContraAct21: boolean = false;
  adminContraAct22: boolean = false;
  adminContraAct23: boolean = false;
  contin1: boolean = false;
  contin2: boolean = false;
  contin3: boolean = false;
  contin4: boolean = false;
  contin5: boolean = false;
  contin6: boolean = false;
  contin7: boolean = false;
  contin8: boolean = false;
  contin9: boolean = false;
  contin20: boolean = false;
  solidEdoCuent1: boolean = false;
  admin1: boolean = false;
  admin2: boolean = false;
  admin3: boolean = false;
  admin4: boolean = false;
  admin5: boolean = false;
  admin6: boolean = false;
  admin7: boolean = false;
  admin8: boolean = false;
  admin9: boolean = false;
  admin10: boolean = false;
  admin11: boolean = false;
  admin12: boolean = false;
  admin13: boolean = false;
  admin14: boolean = false;
  admin15: boolean = false;
  admin16: boolean = false;
  admin17: boolean = false;
  admin18: boolean = false;
  admin19: boolean = false;
  adminCliente1: boolean = false;
  adminCliente2: boolean = false;
  adminCliente3: boolean = false;
  adminCliente4: boolean = false;
  moni1: boolean = false;
  moni2: boolean = false;
  moni3: boolean = false;
  moni4: boolean = false;
  moni5: boolean = false;
  moni6: boolean = false;
  moniApi1: boolean = false;   //nuevo
  moniApi2: boolean = false;   //nuevo
  contoVolOpe1: boolean = false;
  contoVolOpe2: boolean = false;
  contoVolOpe3: boolean = false;
  contoVolOpe4: boolean = false;
  contoVolOpe5: boolean = false;
  contoVolOpe6: boolean = false;
  contoVolOpe7: boolean = false;
  contoVolOpe8: boolean = false;
  contoVolOpe9: boolean = false;
  contoVolOpe10: boolean = false;
  contoVolOpe11: boolean = false;
  contoVolOpe12: boolean = false;
  dupli1: boolean = false;
  dupli2: boolean = false;
  consuReport1: boolean = false;
  consuReport2: boolean = false;
  consuReport3: boolean = false;
  consuReport4: boolean = false;
  consuReport5: boolean = false;
  cuentaGo1: boolean = false;
  consulCFDI1: boolean = false;
  tipoCambio1: boolean = false;
  consulDocCFDI1: boolean = false;
  road1: boolean = false;
  road2: boolean = false;
  road3: boolean = false;
  road4: boolean = false;
  road5: boolean = false;
  data: any;
  menusValidos: any;
  // debe estar en false si se valida el perfilamiento
  perfilamientoFalse: boolean = true;
  pinta1: boolean = this.perfilamientoFalse;
  pinta2: boolean = this.perfilamientoFalse;
  pinta3: boolean = this.perfilamientoFalse;
  pinta4: boolean = this.perfilamientoFalse;
  pinta5: boolean = this.perfilamientoFalse;
  pinta6: boolean = this.perfilamientoFalse;
  pinta7: boolean = this.perfilamientoFalse;
  pinta8: boolean = this.perfilamientoFalse;
  pinta9: boolean = this.perfilamientoFalse;
  pinta10: boolean = this.perfilamientoFalse;
  pinta11: boolean = this.perfilamientoFalse;
  pinta12: boolean = this.perfilamientoFalse;
  pinta13: boolean = this.perfilamientoFalse;
  pinta14: boolean = this.perfilamientoFalse;
  pinta15: boolean = this.perfilamientoFalse;
  pinta16: boolean = this.perfilamientoFalse;
  pinta17: boolean = this.perfilamientoFalse;
  pinta18: boolean = this.perfilamientoFalse;
  pinta19: boolean = this.perfilamientoFalse;
  pinta20: boolean = this.perfilamientoFalse;
  pinta21: boolean = this.perfilamientoFalse;
  pinta22: boolean = this.perfilamientoFalse;
  pinta23: boolean = this.perfilamientoFalse;
  pinta24: boolean = this.perfilamientoFalse;
  pinta25: boolean = this.perfilamientoFalse;
  pinta26: boolean = this.perfilamientoFalse;
  pinta27: boolean = this.perfilamientoFalse;
  pinta28: boolean = this.perfilamientoFalse;
  pinta29: boolean = this.perfilamientoFalse;
  pinta30: boolean = this.perfilamientoFalse;
  pinta31: boolean = this.perfilamientoFalse;
  pinta32: boolean = this.perfilamientoFalse;
  pinta33: boolean = this.perfilamientoFalse;

  pinta34: boolean = this.perfilamientoFalse;
  pinta35: boolean = this.perfilamientoFalse;
  pinta36: boolean = this.perfilamientoFalse;
  pinta37: boolean = this.perfilamientoFalse;
  pinta38: boolean = this.perfilamientoFalse;
  pinta39: boolean = this.perfilamientoFalse;
  pinta40: boolean = this.perfilamientoFalse;
  pinta41: boolean = this.perfilamientoFalse;
  pinta42: boolean = this.perfilamientoFalse;
  pinta43: boolean = this.perfilamientoFalse;
  pinta44: boolean = this.perfilamientoFalse;
  pinta45: boolean = this.perfilamientoFalse;
  pinta46: boolean = this.perfilamientoFalse;
  pinta47: boolean = this.perfilamientoFalse;
  pinta48: boolean = this.perfilamientoFalse;
  pinta49: boolean = this.perfilamientoFalse;

  pinta50: boolean = this.perfilamientoFalse;
  pinta51: boolean = this.perfilamientoFalse;
  pinta52: boolean = this.perfilamientoFalse;
  pinta53: boolean = this.perfilamientoFalse;
  pinta54: boolean = this.perfilamientoFalse;
  pinta55: boolean = this.perfilamientoFalse;
  pinta56: boolean = this.perfilamientoFalse;
  pinta57: boolean = this.perfilamientoFalse;
  pintaMoniApi: boolean = this.perfilamientoFalse; //nuevo
  sinPermisos: boolean = false;
  otro2: any = false;

  navContent: HTMLElement | null
  nav: HTMLElement | null
  lastAccess: string = ''

  showTooltip: boolean = false;
  minutes: number = 0;
  seconds: number = 0;
  isLastFiveMinutes: boolean = false;
  private timerSubscription: Subscription;
  //@ViewChild ('limpiar') limp: any;
  onMouseEnter(): void {
    this.showTooltip = true;
  }

  onMouseLeave(): void {
    this.showTooltip = false;
  }
  ngOnInit(): void {
    this.nav = document.getElementById('customnav');
    this.navContent = document.getElementById('customcont');
    this.timer.startTimer();
    this.timerSubscription = this.timer.timeLeft$.subscribe(time => {
      this.minutes = time.minutes;
      this.seconds = time.seconds;
      this.isLastFiveMinutes = time.isLastFiveMinutes;
    });
  }

  bloquear() {
    // hay que revisar que limpie la entrada principal
    this.service.datosContratoObtenido(false);
    this.service.otro(false);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    //this.limp.limpiar();
  }
  adminContra(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.cierra();
    if (num === 1) {
      this.bloquear();
      this.adminContraAct1 = true;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 2) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = true;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 3) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = true;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 4) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = true;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 5) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = true;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 6) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = true;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 7) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = true;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 8) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = true;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 9) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = true;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 10) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = true;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 11) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = true;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 12) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = true;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 13) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = true;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 14) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = true;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 15) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = true;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 16) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = true;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 17) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = true;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 18) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = true;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 19) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = true;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
    if (num === 20) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = true;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
      this.datosContrato = false;

      this.memory.changeStatusMenu(false);
    }
    if (num === 21) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = true;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
      this.datosContrato = false;

      this.memory.changeStatusMenu(false);
    }
    if (num === 22) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = true;
      this.adminContraAct23 = false;
    }
    if (num === 23) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = true;
    }
    if (num === 0) {
      this.adminContraAct1 = false;
      this.adminContraAct2 = false;
      this.adminContraAct3 = false;
      this.adminContraAct4 = false;
      this.adminContraAct5 = false;
      this.adminContraAct6 = false;
      this.adminContraAct7 = false;
      this.adminContraAct8 = false;
      this.adminContraAct9 = false;
      this.adminContraAct10 = false;
      this.adminContraAct11 = false;
      this.adminContraAct12 = false;
      this.adminContraAct13 = false;
      this.adminContraAct14 = false;
      this.adminContraAct15 = false;
      this.adminContraAct16 = false;
      this.adminContraAct17 = false;
      this.adminContraAct18 = false;
      this.adminContraAct19 = false;
      this.adminContraAct20 = false;
      this.adminContraAct21 = false;
      this.adminContraAct22 = false;
      this.adminContraAct23 = false;
    }
  }

  cierra() {
    this.road1 = false;
    this.road2 = false;
    this.road3 = false;
    this.road4 = false;
    this.road5 = false;
    this.adminContraAct1 = false;
    this.adminContraAct2 = false;
    this.adminContraAct3 = false;
    this.adminContraAct4 = false;
    this.adminContraAct5 = false;
    this.adminContraAct6 = false;
    this.adminContraAct7 = false;
    this.adminContraAct8 = false;
    this.adminContraAct9 = false;
    this.adminContraAct10 = false;
    this.adminContraAct11 = false;
    this.adminContraAct12 = false;
    this.adminContraAct13 = false;
    this.adminContraAct14 = false;
    this.adminContraAct15 = false;
    this.adminContraAct16 = false;
    this.adminContraAct17 = false;
    this.adminContraAct18 = false;
    this.adminContraAct19 = false;
    this.adminContraAct20 = false;
    this.adminContraAct21 = false;
    this.adminContraAct22 = false;
    this.adminContraAct23 = false;
    this.gesProAct1 = false;
    this.gesProAct2 = false;
    this.gesProAct3 = false;
    this.gesProAct4 = false;
    this.gesProAct5 = false;
    this.contin1 = false;
    this.contin2 = false;
    this.contin3 = false;
    this.contin4 = false;
    this.contin5 = false;
    this.contin6 = false;
    this.contin7 = false;
    this.contin8 = false;
    this.contin9 = false;
    this.contin20 = false;
    this.solidEdoCuent1 = false;
    this.admin1 = false;
    this.admin2 = false;
    this.admin3 = false;
    this.admin4 = false;
    this.admin5 = false;
    this.admin6 = false;
    this.admin7 = false;
    this.admin8 = false;
    this.admin9 = false;
    this.admin10 = false;
    this.admin11 = false;
    this.admin12 = false;
    this.admin13 = false;
    this.admin14 = false;
    this.admin15 = false;
    this.admin16 = false;
    this.admin17 = false;
    this.admin18 = false;
    this.admin19 = false;
    this.admin19 = false;
    this.adminCliente1 = false;
    this.adminCliente2 = false;
    this.adminCliente3 = false;
    this.adminCliente4 = false;
    this.moni1 = false;
    this.moni2 = false;
    this.moni3 = false;
    this.moni4 = false;
    this.contoVolOpe1 = false;
    this.contoVolOpe2 = false;
    this.contoVolOpe3 = false;
    this.contoVolOpe4 = false;
    this.contoVolOpe5 = false;
    this.contoVolOpe6 = false;
    this.contoVolOpe7 = false;
    this.contoVolOpe8 = false;
    this.contoVolOpe9 = false;
    this.contoVolOpe10 = false;
    this.contoVolOpe11 = false;
    this.contoVolOpe12 = false;
    this.dupli1 = false;
    this.dupli2 = false;
    this.consuReport1 = false;
    this.consuReport2 = false;
    this.consuReport3 = false;
    this.consuReport4 = false;
    this.consuReport5 = false;
    this.cuentaGo1 = false;
    this.consulCFDI1 = false;
    this.tipoCambio1 = false;
    this.consulDocCFDI1 = false;
  }

  gesPro(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.gesProAct1 = true;
      this.gesProAct2 = false;
      this.gesProAct3 = false;
      this.gesProAct4 = false;
      this.gesProAct5 = false;
    }
    if (num === 2) {
      this.gesProAct2 = true;
      this.gesProAct1 = false;
      this.gesProAct3 = false;
      this.gesProAct4 = false;
      this.gesProAct5 = false;
    }
    if (num === 3) {
      this.router.navigate(['/gestionBuzon', 'gestionConexionContrato']);
      this.gesProAct3 = true;
      this.gesProAct2 = false;
      this.gesProAct1 = false;
      this.gesProAct4 = false;
      this.gesProAct5 = false;
    }

    if (num === 4) {
      this.gesProAct4 = true;
      this.gesProAct2 = false;
      this.gesProAct3 = false;
      this.gesProAct1 = false;
      this.gesProAct5 = false;
    }
    if (num === 5) {
      this.gesProAct5 = true;
      this.gesProAct2 = false;
      this.gesProAct3 = false;
      this.gesProAct1 = false;
      this.gesProAct4 = false;
    }
  }

  contin(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.contin1 = true;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 2) {
      this.contin1 = false;
      this.contin2 = true;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 3) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = true;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 4) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = true;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 5) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = true;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 6) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = true;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 7) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = true;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 8) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = true;
      this.contin9 = false;
      this.contin20 = false;
    }
    if (num === 9) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = true;
      this.contin20 = false;
    }
    if (num === 20) {
      this.contin1 = false;
      this.contin2 = false;
      this.contin3 = false;
      this.contin4 = false;
      this.contin5 = false;
      this.contin6 = false;
      this.contin7 = false;
      this.contin8 = false;
      this.contin9 = false;
      this.contin20 = true;
    }
  }

  solidEdoCuent(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.solidEdoCuent1 = true;
    }
  }

  admin(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.admin1 = true;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
      this.admin19 = false;
    }
    if (num === 2) {
      this.admin1 = false;
      this.admin2 = true;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
      this.admin19 = false;
    }
    if (num === 3) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = true;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 4) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = true;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 5) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = true;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 6) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = true;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 7) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = true;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 8) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = true;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 9) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = true;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 10) {
      this.service.setSaveLocalStorage('cpActualizado', null);
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = true;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 11) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = true;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 12) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = true;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 13) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = true;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 14) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = true;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 15) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = true;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 16) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = true;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 17) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = true;
      this.admin18 = false;
      this.admin19 = false;
    }
    if (num === 18) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = true;
      this.admin19 = false;
    }
    if (num === 19) {
      this.admin1 = false;
      this.admin2 = false;
      this.admin3 = false;
      this.admin4 = false;
      this.admin5 = false;
      this.admin6 = false;
      this.admin7 = false;
      this.admin8 = false;
      this.admin9 = false;
      this.admin10 = false;
      this.admin11 = false;
      this.admin12 = false;
      this.admin13 = false;
      this.admin14 = false;
      this.admin15 = false;
      this.admin16 = false;
      this.admin17 = false;
      this.admin18 = false;
      this.admin19 = true;
    }
  }

  adminCliente(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.adminCliente1 = true;
      this.adminCliente2 = false;
      this.adminCliente3 = false;
      this.adminCliente4 = false;
    }
    if (num === 2) {
      this.adminCliente1 = false;
      this.adminCliente2 = true;
      this.adminCliente3 = false;
      this.adminCliente4 = false;
    }
    if (num === 3) {
      this.adminCliente1 = false;
      this.adminCliente2 = false;
      this.adminCliente3 = true;
      this.adminCliente4 = false;
    }
    if (num === 4) {
      this.adminCliente1 = false;
      this.adminCliente2 = false;
      this.adminCliente3 = false;
      this.adminCliente4 = true;
    }
  }



moniApi(opc: number) {                           //  nuevo
  this.moniApi1 = opc === 1;
  this.moniApi2 = opc === 2;
  this.activeState = 16;    
}  // nuevo



  moni(num: number) {
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.service.setSaveLocalStorage('regrese', null);
      this.moni1 = true;
      this.moni2 = false;
      this.moni3 = false;
      this.moni4 = false;
      this.moni5 = false;
      this.moni6 = false;
    }
    if (num === 2) {
      this.service.setSaveLocalStorage('regrese', null);
      this.moni1 = false;
      this.moni2 = true;
      this.moni3 = false;
      this.moni4 = false;
      this.moni5 = false;
      this.moni6 = false;
    }
    if (num === 3) {
      this.moni1 = false;
      this.moni2 = false;
      this.moni3 = true;
      this.moni4 = false;
      this.moni5 = false;
      this.moni6 = false;
    }
    if (num === 4) {
      this.service.setSaveLocalStorage('regrese', null);
      this.moni1 = false;
      this.moni2 = false;
      this.moni3 = false;
      this.moni4 = true;
      this.moni5 = false;
      this.moni6 = false;
    }
    if (num === 5) {
      this.service.setSaveLocalStorage('regrese', null);
      this.moni1 = false;
      this.moni2 = false;
      this.moni3 = false;
      this.moni4 = false;
      this.moni5 = true;
      this.moni6 = false;
    }
    if (num === 6) {
      this.service.setSaveLocalStorage('regrese', null);
      this.moni1 = false;
      this.moni2 = false;
      this.moni3 = false;
      this.moni4 = false;
      this.moni5 = false;
      this.moni6 = true;
    }
  }

  contoVolOpe(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.contoVolOpe1 = true;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 2) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = true;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 3) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = true;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 4) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = true;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 5) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = true;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 6) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = true;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 7) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = true;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 8) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = true;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 9) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = true;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 10) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = true;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = false;
    }
    if (num === 11) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = true;
      this.contoVolOpe12 = false;
    }
    if (num === 12) {
      this.contoVolOpe1 = false;
      this.contoVolOpe2 = false;
      this.contoVolOpe3 = false;
      this.contoVolOpe4 = false;
      this.contoVolOpe5 = false;
      this.contoVolOpe6 = false;
      this.contoVolOpe7 = false;
      this.contoVolOpe8 = false;
      this.contoVolOpe9 = false;
      this.contoVolOpe10 = false;
      this.contoVolOpe11 = false;
      this.contoVolOpe12 = true;
    }
  }

  dupli(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.dupli1 = true;
      this.dupli2 = false;
    }
    if (num === 2) {
      this.dupli1 = false;
      this.dupli2 = true;
    }
  }
  consuReport(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.consuReport1 = true;
      this.consuReport2 = false;
      this.consuReport3 = false;
      this.consuReport4 = false;
      this.consuReport5 = false;
    }
    if (num === 2) {
      this.consuReport1 = false;
      this.consuReport2 = true;
      this.consuReport3 = false;
      this.consuReport4 = false;
      this.consuReport5 = false;
    }
    if (num === 3) {
      this.consuReport1 = false;
      this.consuReport2 = false;
      this.consuReport3 = true;
      this.consuReport4 = false;
      this.consuReport5 = false;
    }
    if (num === 4) {
      this.consuReport1 = false;
      this.consuReport2 = false;
      this.consuReport3 = false;
      this.consuReport4 = true;
      this.consuReport5 = false;
    }
    if (num === 5) {
      this.consuReport1 = false;
      this.consuReport2 = false;
      this.consuReport3 = false;
      this.consuReport4 = false;
      this.consuReport5 = true;
    }
  }

  cuentaGo(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1000) {
      this.cuentaGo1 = true;
    }
  }
  consulCFDI(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.consulCFDI1 = true;
    }
  }
  tipoCambio(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.tipoCambio1 = true;
    }
  }
  consulDocCFDI(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.consulDocCFDI1 = true;
    }
  }

  road(num: number) {
    this.service.setSaveLocalStorage('regrese', null);
    this.datosContrato = false;
    this.memory.changeStatusMenu(false);
    this.cierra();
    if (num === 1) {
      this.datosContrato = false;
      this.memory.changeStatusMenu(false);
      this.road1 = true;
      this.road2 = false;
      this.road3 = false;
      this.road4 = false;
      this.road5 = false;
    }
    if (num === 2) {
      this.datosContrato = false;
      this.memory.changeStatusMenu(false);
      this.road2 = true;
      this.road1 = false;
      this.road3 = false;
      this.road4 = false;
      this.road5 = false;
    }
    if (num === 3) {
      this.datosContrato = false;
      this.memory.changeStatusMenu(false);
      this.road3 = true;
      this.road1 = false;
      this.road2 = false;
      this.road4 = false;
      this.road5 = false;
    }
    if (num === 4) {
      this.datosContrato = false;
      this.memory.changeStatusMenu(false);
      this.road4 = true;
      this.road1 = false;
      this.road2 = false;
      this.road3 = false;
      this.road5 = false;
    }
    if (num === 5) {
      this.datosContrato = true;
      this.otro = true
      this.road5 = true;
      this.road1 = false;
      this.road2 = false;
      this.road3 = false;
      this.road4 = false;
    }
  }

  abrir(num: any, event: any) {
    if (num === 1) {
      this.activeState = 1;
      this.items.push('1');
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      this.items16.splice(0, this.items16.length);

      if (this.items.length === 2) {
        this.showSubSubMenu = false;
        this.items.splice(0, this.items.length);
      } else {
        this.showSubSubMenu = true;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }
    if (num === 2) {
      this.items2.push('1');
      this.activeState = 2;
      this.service.datosContratoObtenido(false);
      this.service.otro(false);
      this.items.splice(0, this.items.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items2.length === 2) {
        this.showSubSubMenu2 = false;
        this.items2.splice(0, this.items2.length);
      } else {
        this.showSubSubMenu2 = true;
        this.showSubSubMenu = false;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }
    if (num === 3) {
      this.items3.push('1');
      this.activeState = 3;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items3.length === 2) {
        this.showSubSubMenu3 = false;
        this.items3.splice(0, this.items3.length);
      } else {
        this.showSubSubMenu3 = true;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 4) {
      this.items4.push('1');
      this.activeState = 4;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items4.length === 2) {
        this.showSubSubMenu4 = false;
        this.items4.splice(0, this.items4.length);
      } else {
        this.showSubSubMenu4 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 5) {
      this.items5.push('1');
      this.activeState = 5;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items5.length === 2) {
        this.showSubSubMenu5 = false;
        this.items5.splice(0, this.items5.length);
      } else {
        this.showSubSubMenu5 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 6) {
      this.items6.push('1');
      this.activeState = 6;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items6.length === 2) {
        this.showSubSubMenu6 = false;
        this.items6.splice(0, this.items6.length);
      } else {
        this.showSubSubMenu6 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 7) {
      this.items7.push('1');
      this.activeState = 7;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items7.length === 2) {
        this.showSubSubMenu7 = false;
        this.items7.splice(0, this.items7.length);
      } else {
        this.showSubSubMenu7 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 8) {
      this.items8.push('1');
      this.activeState = 8;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items8.length === 2) {
        this.showSubSubMenu8 = false;
        this.items8.splice(0, this.items8.length);
      } else {
        this.showSubSubMenu8 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 9) {
      this.items9.push('1');
      this.activeState = 9;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items9.length === 2) {
        this.showSubSubMenu9 = false;
        this.items9.splice(0, this.items9.length);
      } else {
        this.showSubSubMenu9 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 10) {
      this.items10.push('1');
      this.activeState = 10;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items10.length === 2) {
        this.showSubSubMenu10 = false;
        this.items10.splice(0, this.items10.length);
      } else {
        this.showSubSubMenu10 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 11) {
      this.items11.push('1');
      this.activeState = 11;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items11.length === 2) {
        this.showSubSubMenu11 = false;
        this.items11.splice(0, this.items11.length);
      } else {
        this.showSubSubMenu11 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 12) {
      this.items12.push('1');
      this.activeState = 12;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items12.length === 2) {
        this.showSubSubMenu12 = false;
        this.items12.splice(0, this.items12.length);
      } else {
        this.showSubSubMenu12 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 13) {
      this.items13.push('1');
      this.activeState = 13;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items14.splice(0, this.items14.length);
      this.items15.splice(0, this.items15.length);
      if (this.items13.length === 2) {
        this.showSubSubMenu13 = false;
        this.items13.splice(0, this.items13.length);
      } else {
        this.showSubSubMenu13 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu14 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 14) {
      this.items14.push('1');
      this.activeState = 14;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items15.splice(0, this.items15.length);
      if (this.items14.length === 2) {
        this.showSubSubMenu14 = false;
        this.items14.splice(0, this.items14.length);
      } else {
        this.showSubSubMenu14 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu15 = false;
      }
    }

    if (num === 15) {
      this.items15.push('1');
      this.activeState = 15;
      this.items.splice(0, this.items.length);
      this.items2.splice(0, this.items2.length);
      this.items3.splice(0, this.items3.length);
      this.items4.splice(0, this.items4.length);
      this.items5.splice(0, this.items5.length);
      this.items6.splice(0, this.items6.length);
      this.items7.splice(0, this.items7.length);
      this.items8.splice(0, this.items8.length);
      this.items9.splice(0, this.items9.length);
      this.items10.splice(0, this.items10.length);
      this.items11.splice(0, this.items11.length);
      this.items12.splice(0, this.items12.length);
      this.items13.splice(0, this.items13.length);
      this.items14.splice(0, this.items14.length);
      if (this.items15.length === 2) {
        this.showSubSubMenu15 = false;
        this.items15.splice(0, this.items15.length);
      } else {
        this.showSubSubMenu15 = true;
        this.showSubSubMenu3 = false;
        this.showSubSubMenu = false;
        this.showSubSubMenu2 = false;
        this.showSubSubMenu4 = false;
        this.showSubSubMenu5 = false;
        this.showSubSubMenu6 = false;
        this.showSubSubMenu7 = false;
        this.showSubSubMenu8 = false;
        this.showSubSubMenu9 = false;
        this.showSubSubMenu10 = false;
        this.showSubSubMenu11 = false;
        this.showSubSubMenu12 = false;
        this.showSubSubMenu13 = false;
        this.showSubSubMenu14 = false;
      }
    }
     
    if (num === 16) {          // nuevo
  this.items16.push('1');
  this.activeState = 16;
  this.items.splice(0,  this.items.length);
  this.items2.splice(0, this.items2.length);
  this.items3.splice(0, this.items3.length);
  this.items4.splice(0, this.items4.length);
  this.items5.splice(0, this.items5.length);
  this.items6.splice(0, this.items6.length);
  this.items7.splice(0, this.items7.length);
  this.items8.splice(0, this.items8.length);
  this.items9.splice(0, this.items9.length);
  this.items10.splice(0,this.items10.length);
  this.items11.splice(0,this.items11.length);
  this.items12.splice(0,this.items12.length);
  this.items13.splice(0,this.items13.length);
  this.items14.splice(0,this.items14.length);
  this.items15.splice(0,this.items15.length);
    if (this.items16.length === 2) {
    this.showSubSubMenuMoniApi = false;
    this.items16.splice(0, this.items16.length);
  } else {
    this.showSubSubMenuMoniApi = true;
    this.showSubSubMenu   = false;
    this.showSubSubMenu2  = false;
    this.showSubSubMenu3  = false;
    this.showSubSubMenu4  = false;
    this.showSubSubMenu5  = false;
    this.showSubSubMenu6  = false;
    this.showSubSubMenu7  = false;
    this.showSubSubMenu8  = false;
    this.showSubSubMenu9  = false;
    this.showSubSubMenu10 = false;
    this.showSubSubMenu11 = false;
    this.showSubSubMenu12 = false;
    this.showSubSubMenu13 = false;
    this.showSubSubMenu14 = false;
    this.showSubSubMenu15 = false;
  }
}


  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
      this.nav?.classList.add('nav-hidden');
      this.navContent?.classList.add('mr-left-content');
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
      this.nav?.classList.remove('nav-hidden');
      this.navContent?.classList.remove('mr-left-content');
    }
  }

  /* Titulo de la pantalla recibido como entrada */
  @Input() tituloHeader!: string;
  /***Atributo que almacena el ultimo acceso al sistema */
  ultimoAcceso: string | undefined;
  /***Atributo que almacena la clave del usuario logueado*/
  claveUsuario: string | null;
  /***Atributo que almacena el nombre del usuario logueado */
  nombreEmpleado: string | undefined;

  /* Constructor de la clase */
  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private globals: Globals,
    private service: ComunesService,
    public parametrosService: parametrosService,
    private router: Router,
    private memory: MemoryService,
    private perfil: PerfilamientoService,
    private timer: TimerSessionService,
    private alarmas: GestionAlarmaService
  ) {

    this.service.setSaveLocalStorage('valorActivo', false);
    this.otro2 = false
    this.service.otro(false);
    this.claveUsuario = localStorage.getItem('UserID');
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.cambiarIdioma('es')
    console.log('Inicia el constructor del header 1');
    if (this.claveUsuario === 'undefined' || this.claveUsuario === '' || this.claveUsuario === null) {
      this.claveUsuario = 'USR00000';
      this.sinPermisos = true;
      this.service.setSaveLocalStorage('sinPermisos', true);
      this.service.setSaveLocalStorage('showAlertas', false);
      this.service.setSaveLocalStorage('bandSPEI', false);
      //redireccionaimento a login
      console.info('No se obtuvo el usuario, se redireccionara a login ');
      // Redirect to the URL stored in the environment variable
      if (service.urlLogAzure) {
        console.info('envio a urlLogAzure');
        window.location.href = service.urlLogAzure;
      } else {
        console.log('No se obtuvo la url de logAzure, se redireccionara a login por localStorage');
        let vurl = localStorage.getItem('logAzure');
        if (vurl) {
          console.info('envio a logAzure');
          window.location.href = service.urlLogAzure;
        } else {
          console.info('No se obtuvo la url de logAzure');
          return;
        }
      }
    }
    console.log('Inicia el constructor del header 2');
    setTimeout(() => {
      this.perfil.perfilamiento(this.claveUsuario).then(async response => {
        if (response.perfil === '') {
          this.sinPermisos === true
          this.service.setSaveLocalStorage('sinPermisos', true);
          this.globals.loaderSubscripcion.emit(false);
          return;
        }

        this.service.setSaveLocalStorage('sinPermisos', false);
        this.data = {
          "usuario": response.usuario,
          "diferenciador": response.diferenciador,
          "perfil": response.perfil
        }
        console.log('Inicia el constructor del header 3');
        this.service.setSaveLocalStorage('perfilamiento', response);
        this.perfil.menus(this.data).then(resp => {
          this.menusValidos = resp.menus
          this.menusValidos.forEach((value: any) => {
            if (value === this.pintarContrato) {
              this.pinta1 = true
            }
            if (value === this.pintarAltaContrato) {
              this.pinta2 = true
            }
            if (value === this.pintarConsultaContratoUsuario) {
              this.pinta3 = true
            }
            if (value === this.pintarConsultaUsuario) {
              this.pinta4 = true
            }
            if (value === this.pintarProducto) {
              this.pinta5 = true
            }
            if (value === this.pintarCuentasOrdenantes) {
              this.pinta6 = true
            }
            if (value === this.pintarUsuariosOperantes) {
              this.pinta7 = true
            }
            if (value === this.pintarNotificaciones) {
              this.pinta8 = true
            }
            if (value === this.pintarParametros) {
              this.pinta9 = true
            }
            if (value === this.pintarReporteCobranza) {
              this.pinta10 = true
            }
            if (value === this.pintarEstadoCuenta) {
              this.pinta11 = true
            }
            if (value === this.pintarEsquemaComision) {
              this.pinta12 = true
            }
            if (value === this.pintarCobroComision) {
              this.pinta13 = true
            }
            if (value === this.pintarCuentasBeneficiarias) {
              this.pinta14 = true
            }
            if (value === this.pintarConvenioContrato) {
              this.pinta15 = true
            }
            if (value === this.pintarContingencia) {
              this.pinta16 = true
            } if (value === this.pintarEoCuenta) {
              this.pinta17 = true
            } if (value === this.pintarBuzon) {
              this.pinta18 = true
            } if (value === this.pintarProtocolos) {
              this.pinta19 = true
            } if (value === this.pintarCanales) {
              this.pinta20 = true
            } if (value === this.pintarDelContrato) {
              this.pinta21 = true
            } if (value === this.pintarAdmin) {
              this.pinta22 = true
            } if (value === this.pintarBackend) {
              this.pinta23 = true
            } if (value === this.pintarBancos) {
              this.pinta24 = true
            } if (value === this.pintarLayputs) {
              this.pinta25 = true
            } if (value === this.pintarMNotificaciones) {
              this.pinta26 = true
            } if (value === this.pintarProdcutos) {
              this.pinta27 = true
            } if (value === this.pintarMensajeError) {
              this.pinta28 = true
            } if (value === this.pintarCatDinamico) {
              this.pinta29 = true
            } if (value === this.pintarCancelOperaciones) {
              this.pinta30 = true
            } if (value === this.pintarAdmonClient) {
              this.pinta31 = true
            } if (value === this.pintarApi) {
              this.pinta32 = true
            } if (value === this.pintarCertificado) {
              this.pinta33 = true
            } if (value === this.pintarAdBuzon) {
              this.pinta34 = true
            } if (value === this.pintarMonitoreo) {
              this.pinta35 = true
            } if (value === this.pintarTraing) {
              this.pinta36 = true
            } if (value === this.pintarMonSaldos) {
              this.pinta37 = true
            } if (value === this.pintarMonitorOP) {
              this.pinta38 = true
            } if (value === this.pintarOperativo) {
              this.pinta39 = true
            }
            if (value === this.pintarGraficaCliente) {
              this.pinta40 = true
            } if (value === this.pintarGraficaEstatusCliente) {
              this.pinta41 = true
            } if (value === this.pintarGraficaEstatusClienteParam) {
              this.pinta42 = true
            } if (value === this.pintarGraficaArchivoCliente) {
              this.pinta43 = true
            } if (value === this.pintarTotalOperacionesProductos) {
              this.pinta44 = true
            } if (value === this.pintarTotalOperacionesCliente) {
              this.pinta45 = true
            } if (value === this.pintarConsolidadoOperaciones) {
              this.pinta46 = true
            } if (value === this.pintarConsolidados) {
              this.pinta47 = true
            } if (value === this.pintarConsolidadoCliente) {
              this.pinta48 = true
            }
            if (value === this.pintarReportes) {
              this.pinta49 = true
            } if (value === this.pintarCuentasBene) {
              this.pinta50 = true
            } if (value === this.pintarComisiones) {
              this.pinta51 = true
            }
            if (value === this.pintarPistas) {
              this.pinta52 = true
            } if (value === this.pintarBitacora) {
              this.pinta53 = true
            } if (value === this.pintarReportes2) {
              this.pinta54 = true
            } if (value === this.pintarReportesMas) {
              this.pinta55 = true
            }
            if (value === this.pintarGo) {
              this.pinta56 = true
            }
          });
          this.globals.loaderSubscripcion.emit(false);
        });
        console.log('Inicia el constructor del header 4');
        try {
          const initUsu = await this.perfil.inicio(this.claveUsuario) as { lastAccess: string };
          this.lastAccess = initUsu.lastAccess;
          this.globals.loaderSubscripcion.emit(false);

        } catch (error) {
          this.globals.loaderSubscripcion.emit(false);
        }
        console.log('Inicia el constructor del header 5');
        try {
          const alarmasp = await this.alarmas.getAlarmasPendientes(this.claveUsuario, this.service.getUrl()) as { pendientes: boolean, bandSPEI: boolean };

          this.service.setSaveLocalStorage('bandSPEI', alarmasp.bandSPEI);
          this.service.setSaveLocalStorage('showAlertas', alarmasp.pendientes);
          this.globals.loaderSubscripcion.emit(false);
        } catch (error) {
          this.globals.loaderSubscripcion.emit(false);
        }
      });
    }, 2000);
  }

  ngAfterViewChecked(): void {
    this.otro2 = this.service.getSaveLocalStorage('valorActivo');
    this.datosContrato = this.service.response;
    this.otro = this.service.response
    if (this.datosContrato === undefined || this.datosContrato === '') {
      this.datosContrato = false
    }
    this.contingencia();
    this.abriProducto();
    this.startObsMenu();
  }

  ngOnDestroy() {
    this.controlActions.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  contingencia() {
    if (this.contin6 !== true) {
      this.parametrosService.setShowParametros(false);
    }
  }

  abriProducto() {
    var x = this.service.getSaveLocalStorage('activarProducto');
    if (x === true) {
      this.adminContra(2);
      this.service.setSaveLocalStorage('activarProducto', null);
    }
  }

  cambiarIdioma(idioma: any) {
    if (idioma === 'es') {
      this.service.setSaveLocalStorage('idioma', 1);
    } else {
      this.service.setSaveLocalStorage('idioma', 2);
    }
    this.translate.use(idioma);
    this.service.eventClickReloadGraph(true)
    this.globals.loaderSubscripcion.emit(false);
  }

  cerrarSesion() {
    this.open('', this.translate.instant('modal.comun.mensaje.salir.sesion'), 'yesNo');
  }

  resetTimer(): void {
  }
  open(titulo: string, contenido: string, type: any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type), hasBackdrop: true
    })
    dialogo.afterClosed().subscribe(result => {
      if (result === 'si') {
        this.perfil.salir(this.claveUsuario).then(response => {
          if (response.status === '200') {
            this.service.setSaveLocalStorage('fin', true);
          } else {
            this.service.setSaveLocalStorage('fin', false);
          }
          this.globals.loaderSubscripcion.emit(false);

        });
        this.service.redirect();
      }
    });
  }

  startObsMenu() {
    this.controlActions = this.memory.actionObservable$.subscribe(
      (responseAction: any) => {
        if (responseAction.response === true) {
          this.datosContrato = true;
          this.otro = true
        }
      }
    );
  }

  emitClickCurrentPage(codeMenu: number): void {
    this.service.eventClickOnCurrentPage(codeMenu);
  }

  inicio() {
    this.activeState = 0;
    this.showSubSubMenu = false;
    this.showSubSubMenu2 = false;
    this.showSubSubMenu3 = false;
    this.showSubSubMenu4 = false;
    this.showSubSubMenu5 = false;
    this.showSubSubMenu6 = false;
    this.showSubSubMenu7 = false;
    this.showSubSubMenu8 = false;
    this.showSubSubMenu9 = false;
    this.showSubSubMenu10 = false;
    this.showSubSubMenu11 = false;
    this.showSubSubMenu12 = false;
    this.showSubSubMenu13 = false;
    this.showSubSubMenu14 = false;
    this.showSubSubMenu15 = false;
    this.showSubSubMenuMoniApi = false;   // NUEVO

    this.items = [];
    this.items2 = [];
    this.items3 = [];
    this.items4 = [];
    this.items5 = [];
    this.items6 = [];
    this.items7 = [];
    this.items8 = [];
    this.items9 = [];
    this.items10 = [];
    this.items11 = [];
    this.items12 = [];
    this.items13 = [];
    this.items14 = [];
    this.items15 = [];
  }
}
