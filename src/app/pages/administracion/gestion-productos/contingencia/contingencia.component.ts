import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GestionProductosService } from 'src/app/services/administracion/gestion-productos.service';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';

@Component({
  selector: 'app-contingencia',
  templateUrl: './contingencia.component.html',
  styleUrls: ['./contingencia.component.css'],
})
export class ContingenciaComponent implements OnInit {
  origen: any;
  id: any;
  listado: any[];
  formContingencia: UntypedFormGroup;
  modifica = false;
  factorEnvio: any;
  factorPend: any;
  horaMaxPermitida: any;
  descProd: any;
  noData = false;
  fechaCierrePend = new Date();
  fechaCierreConsulta = new Date();
  cveProdOper: any;
  perfilamiento: any;
  verAgregar: boolean = false;
  verEditar: boolean = false;
  verEliminar: boolean = false;
  verAgregarContingencia: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    public gestionProductosService: GestionProductosService,
    private globals: Globals,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private comunService: ComunesService,
    public perfila: PerfilamientoService,
  ) { }

  async ngOnInit() {

    /** Se inicializa el formulario para validar el Producto */
    this.formContingencia = this.formBuilder.group({
      dia: ['', Validators.required],
      horaIni: ['', Validators.required],
      horaFin: ['', Validators.required],
      horaCie: ['', Validators.required],
      horaCiePend: ['', Validators.required],
      activo: [false],
    });
    /*this.perfilamiento = this.comunService.getSaveLocalStorage('perfilamiento');
    const usu = {
      "usuario": this.perfilamiento.usuario,
      "diferenciador": this.perfilamiento.diferenciador,
      "perfil": this.perfilamiento.perfil,
    }

    const perfil = {
      'perfilamientoUsuario': usu,
      "url": "/administracion/productos/guardarPeriodoProd.do",
      "componente": "guardaPeriodo"
    }
    const perfil2 = {
      'perfilamientoUsuario': usu,
      "url": "/administracion/productos/editarPeriodoProd.do",
      "componente": "editaPeriodo"
    }
    const perfil3 = {
      'perfilamientoUsuario': usu,
      "url": "/administracion/productos/eliminarPeriodoProd.do",
      "componente": "eliminaPeriodo"
    }
    const perfil4 = {
      'perfilamientoUsuario': usu,
      "url": "/administracion/productos/guardarContingenciaProd.do",
      "componente": "guardarContingencia"
    }

    try {
      await this.perfila.accion(perfil).then(
        async (result: any) => {
          if (result.message === 'La operacion es valida') {*/
    this.verAgregar = true
    /*}
    await this.perfila.accion(perfil2).then(async (result: any) => {
      if (result.message === 'La operacion es valida') {*/
    this.verEditar = true
    /*}
    await this.perfila.accion(perfil3).then(async (result: any) => {
      if (result.message === 'La operacion es valida') {*/
    this.verEliminar = true
    /*}
    await this.perfila.accion(perfil4).then(async (result: any) => {
      if (result.message === 'La operacion es valida') {*/
    this.verAgregarContingencia = true
    /*}*/
    this.origen = this.route.snapshot.paramMap.get('origen');
    this.id = this.route.snapshot.paramMap.get('id');
    this.descProd = this.route.snapshot.paramMap.get('descProd');
    if (this.origen === 'periodo') {
      this.getId(this.id);
    } else {
      this.getContingenciaId(this.id);
    }
    this.globals.loaderSubscripcion.emit(false);
    /*}
    )
  }
  )
}
)
}
)
} catch {
this.globals.loaderSubscripcion.emit(false);
this.open(this.translateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', 'error', '', '');

}*/
  }

  get formControlContingencia() {
    return this.formContingencia.controls;
  }

  private async getId(id: any) {
    try {
      await this.gestionProductosService
        .gesperiodosId(id)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.listado = result.periodos;
          this.factorEnvio = result.factorEnvio;
          this.factorPend = result.factorPend;
          this.horaMaxPermitida = result.horaMaxPermitida;
          this.formContingencia.controls['dia'].setValue(0);
          this.formContingencia.controls['horaIni'].setValue('');
          this.formContingencia.controls['horaFin'].setValue('');
          this.formContingencia.controls['horaCie'].setValue('');
          this.formContingencia.controls['activo'].setValue('');
        });
    } catch (e) {
      /** Se establece el page en el 0 */
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translateService.instant('modal.error.msjDescargaTitulo'), this.translateService.instant('administracion.mensajeerror.modificadoNoData'), 'error');
    }
  }

  private async getContingenciaId(id: any) {
    try {
      await this.gestionProductosService
        .getContingenciaId(id)
        .then(async (result: any) => {
          if (result.contingencia && result.contingencia.length > 0) {
            let dia = new Date(result.contingencia[0].fechOper).getDay();
            if (dia === 0) dia = 7;
            this.formContingencia.setValue({
              dia: dia,
              horaIni: this.formatHour(result.contingencia[0].horaIni),
              horaFin: this.formatHour(result.contingencia[0].horaFin),
              horaCie: this.formatHour(result.contingencia[0].horaCier),
              horaCiePend: this.formatHour(result.contingencia[0].horaCierPend),
              activo: result.contingencia[0].bandSesi === 'A' ? true : false,
            });
            this.cveProdOper = result.contingencia[0].cveProdOper;
            this.factorEnvio = result.factorEnvio;
            this.factorPend = result.factorPend;
            this.formContingencia.controls['activo'].disable();
            var camposCierre = this.formContingencia.value.horaCie.split(':');
            this.fechaCierreConsulta.setHours(camposCierre[0]);
            this.fechaCierreConsulta.setMinutes(camposCierre[1]);
            this.fechaCierreConsulta.setSeconds(0);
            this.calculateHoraCierre('contingencia');
          } else {
            this.open(
              this.translateService.instant(
                'cuentas.ordenantes.msjINF00010Titulo'
              ),
              this.translateService.instant('gestion.msjNoChangeToday').replace('PRODUCTO', this.descProd),
              'info',
              this.translateService.instant('gestion.codNoChange'),
              ''
            );
            this.noData = true;
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      /** Se establece el page en el 0 */
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translateService.instant('gestion.genericError'),
        'info',
        '',
        ''
      );
    }
  }

  applyTrim(event: any) {
    event.target.value = event.target.value.trim();
  }

  formatHour(hour: string) {
    let ret = hour || '';
    ret = ret.padStart(4, '0');
    return ret.substring(0, 2) + ':' + ret.substring(2, 4);
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

  savePeriodo() {
    let enviarDatos = {
      idProduct: parseInt(this.id),
      dia: parseInt(this.formContingencia.controls['dia'].value),
      horaIni: this.formContingencia.value.horaIni,
      horaFin: this.formContingencia.value.horaFin,
      horaCierre: this.formContingencia.value.horaCie,
      bandActivo: this.formContingencia.value.activo === true ? 'A' : 'I',
    };
    let messageReq = '';
    let message = '';
    if (!enviarDatos.dia || enviarDatos.dia === 0) {
      message = this.translateService.instant('administracion.productos.selDia');
    }
    if (!enviarDatos.horaIni) {
      messageReq = this.translateService.instant('administracion.productos.horaInicial');
    }
    if (enviarDatos.horaIni && !this.validateFormatoHora(enviarDatos.horaIni)) {
      message = this.translateService.instant('administracion.productos.formatoIncorrectoHrIn');
    }
    if (!enviarDatos.horaFin) {
      messageReq = this.translateService.instant('administracion.productos.horaFinal');
    }
    if (enviarDatos.horaFin && !this.validateFormatoHora(enviarDatos.horaFin)) {
      message = this.translateService.instant('administracion.productos.formatoIncorrectoHrFin');
    }
    if (!enviarDatos.horaCierre) {
      messageReq = this.translateService.instant('administracion.productos.horaCierre');
    }
    if (
      enviarDatos.horaCierre &&
      !this.validateFormatoHora(enviarDatos.horaCierre)
    ) {
      message = this.translateService.instant('administracion.productos.formatoIncorrectoHrCierre');
    }
    /** Validacion de horas seleccionadas */
    var fechaIni = new Date();
    var fechaFin = new Date();
    var fechaCierre = new Date();
    var fechalimite = new Date();
    var horaIni = enviarDatos.horaIni;
    var horaFin = enviarDatos.horaFin;
    var horaCierre = enviarDatos.horaCierre;

    var fechaMensaje = new Date();
    var factorCierreEnv = parseInt(this.factorEnvio);
    var factorCierrePend = parseInt(this.factorPend);
    var horaMax = this.horaMaxPermitida.substring(0, 2);
    var minMaximo = this.horaMaxPermitida.substring(3, 5);

    fechalimite.setHours(horaMax);
    fechalimite.setMinutes(minMaximo);
    fechalimite.setSeconds(0);
    fechalimite.setMilliseconds(0);

    var camposIni = horaIni.split(':');
    fechaIni.setHours(camposIni[0]);
    fechaIni.setMinutes(camposIni[1]);
    fechaIni.setSeconds(0);
    fechaIni.setMilliseconds(0);

    var camposFin = horaFin.split(':');
    fechaFin.setHours(camposFin[0]);
    fechaFin.setMinutes(camposFin[1]);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    var camposCierre = horaCierre.split(':');
    fechaCierre.setHours(camposCierre[0]);
    fechaCierre.setMinutes(camposCierre[1]);
    fechaCierre.setSeconds(0);
    fechaCierre.setMilliseconds(0);

    var horaActual = new Date();
    horaActual.setTime(horaActual.getTime() + 5 * 60 * 1000);
    fechaMensaje.setTime(
      fechalimite.getTime() - (factorCierreEnv + factorCierrePend) * 60 * 1000
    );

    if (this.validateFechas(fechaIni, fechaFin)) {
      message = this.translateService.instant('administracion.mensajeerror.modificadoMayorHour');
    } else if (this.validateFechas(fechaFin, fechaCierre)) {
      message =
        this.translateService.instant('administracion.mensajeerror.modificadoNoValidHour') +
        fechaMensaje.getHours() +
        ':' +
        ('0' + fechaMensaje.getMinutes()).slice(-2);
    } else if (!this.validateFechas(fechalimite, this.fechaCierrePend)) {
      message =
        this.translateService.instant('administracion.mensajeerror.modificadoNoValidHour') +
        fechaMensaje.getHours() +
        ':' +
        ('0' + fechaMensaje.getMinutes()).slice(-2);
    }
    if (message !== '') {
      this.open('Error', message, 'error');
      return;
    } else if (messageReq !== '') {
      this.open('Error', this.translateService.instant('administracion.mensajeerror.modificadoRequiredField', { messageReq: messageReq }), 'error');
      return;
    }

    let titulo = '';
    let contenido = '';
    if (this.modifica) {
      titulo = this.translateService.instant('administracion.productos.periodo.leyendaTituloModificar');
      contenido = this.translateService.instant('administracion.productos.periodo.leyendaAsk');
    } else {
      titulo = this.translateService.instant('administracion.productos.periodo.leyendaTituloAlta');
      contenido = this.translateService.instant('administracion.productos.periodo.leyendaAsk');
    }
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "confirm"), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.saveRecordPeriodo(enviarDatos);
      }
    });
  }

  private async saveRecordPeriodo(enviarDatos: any) {
    try {
      if (this.modifica) {
        this.gestionProductosService
          .updatePeriodo(enviarDatos)
          .then(async (result: any) => {
            if (this.origen === 'periodo') {
              this.getId(this.id);
            } else {
              this.getContingenciaId(this.id);
            }
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
              this.translateService.instant('gestion.saveSuccess'),
              'info',
              this.translateService.instant('gestion.codAviso')
            );
          });
      } else {
        this.gestionProductosService
          .savePeriodo(enviarDatos)
          .then(async (result: any) => {
            if (this.origen === 'periodo') {
              this.getId(this.id);
            } else {
              this.getContingenciaId(this.id);
            }
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
              this.translateService.instant('gestion.saveSuccess'),
              'info',
              this.translateService.instant('gestion.codAviso')
            );
          });
      }
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('Error'),
        this.translateService.instant('gestion.failSave'),
        'error'
      )
    }
  }

  saveContingecia() {
    let enviarDatos = {
      idProduct: parseInt(this.cveProdOper),
      dia: parseInt(this.formContingencia.controls['dia'].value),
      horaIni: this.formContingencia.value.horaIni,
      horaFin: this.formContingencia.value.horaFin,
      horaCierre: this.formContingencia.value.horaCie,
      bandActivo: this.formContingencia.value.activo === true ? 'A' : 'I',
    };
    let messageReq = '';
    let message = '';
    if (!enviarDatos.horaIni) {
      messageReq = this.translateService.instant('administracion.productos.periodo.horaIni');
    }
    if (enviarDatos.horaIni && !this.validateFormatoHora(enviarDatos.horaIni)) {
      message =
        this.translateService.instant('administracion.productos.periodo.errFormato');
    }
    if (!enviarDatos.horaFin) {
      messageReq = this.translateService.instant('administracion.productos.periodo.horaFin');
    }
    if (enviarDatos.horaFin && !this.validateFormatoHora(enviarDatos.horaFin)) {
      message =
        this.translateService.instant('administracion.productos.periodo.errFormato');
    }
    if (!enviarDatos.horaCierre) {
      messageReq = this.translateService.instant('administracion.productos.periodo.horaCierre');
    }
    if (
      enviarDatos.horaCierre &&
      !this.validateFormatoHora(enviarDatos.horaCierre)
    ) {
      message =
        this.translateService.instant('administracion.productos.periodo.errFormatoCierre');
    }
    /** Validacion de horas seleccionadas */
    var fechaIni = new Date();
    var fechaFin = new Date();
    var fechaCierre = new Date();
    var fechalimite = new Date();
    var horaIni = enviarDatos.horaIni;
    var horaFin = enviarDatos.horaFin;
    var horaCierre = enviarDatos.horaCierre;

    var fechaMensaje = new Date();
    var factorCierreEnv = parseInt(this.factorEnvio);
    var factorCierrePend = parseInt(this.factorPend);

    fechalimite.setHours(23);
    fechalimite.setMinutes(50);
    fechalimite.setSeconds(0);
    fechalimite.setMilliseconds(0);

    var camposIni = horaIni.split(':');
    fechaIni.setHours(camposIni[0]);
    fechaIni.setMinutes(camposIni[1]);
    fechaIni.setSeconds(0);
    fechaIni.setMilliseconds(0);

    var camposFin = horaFin.split(':');
    fechaFin.setHours(camposFin[0]);
    fechaFin.setMinutes(camposFin[1]);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    var camposCierre = horaCierre.split(':');
    fechaCierre.setHours(camposCierre[0]);
    fechaCierre.setMinutes(camposCierre[1]);
    fechaCierre.setSeconds(0);
    fechaCierre.setMilliseconds(0);

    var horaActual = new Date();
    horaActual.setTime(horaActual.getTime() + 5 * 60 * 1000);
    fechaMensaje.setTime(
      fechalimite.getTime() - (factorCierreEnv + factorCierrePend) * 60 * 1000
    );

    if (this.validateFechas(fechaIni, fechaFin)) {
      message = this.translateService.instant('administracion.productos.periodo.leyendaErrorFecha1');
    } else if (this.validateFechas(horaActual, fechaFin)) {
      message = this.translateService.instant('administracion.productos.periodo.leyendaErrorMayorActual');
    } else if (this.validateFechas(fechaFin, fechaCierre)) {
      message =
        this.translateService.instant('administracion.productos.contingencia.validaHoraCierre') +
        fechaMensaje.getHours() +
        ':' +
        ('0' + fechaMensaje.getMinutes()).slice(-2);
    } else if (!this.validateFechas(fechalimite, this.fechaCierrePend)) {
      message =
        this.translateService.instant('administracion.productos.contingencia.validaHoraCierre') +
        fechaMensaje.getHours() +
        ':' +
        ('0' + fechaMensaje.getMinutes()).slice(-2);
    }
    if (message !== '') {
      this.open('Error', message, 'error');
      return;
    } else if (messageReq !== '') {
      this.open('Error', this.translateService.instant('administracion.mensajeerror.modificadoRequiredField', { messageReq: messageReq }), 'error');
      return;
    }

    let titulo = '';
    let contenido = '';
    if (this.validateFechas(new Date(), this.fechaCierreConsulta)) {
      titulo = this.translateService.instant('administracion.productos.periodo.leyendaTituloCierre');
      contenido = this.translateService.instant('administracion.productos.periodo.leyendaCierre');
    } else {
      titulo = this.translateService.instant('administracion.productos.periodo.leyendaTituloAlta');
      contenido = this.translateService.instant('administracion.productos.periodo.leyendaAlta');
    }
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "confirm"), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.saveRecordContingencia(enviarDatos);
      }
    });
  }

  /** Funcion para validar la hora */
  validateFormatoHora(hora: any) {
    var resp = false;
    var originalHora = hora.trim();
    if (originalHora.length > 0) {
      var filter = new RegExp('([0-1][0-9]|2[0-3]):([0-5][0-9])');
      if (filter.test(originalHora)) {
        resp = true;
      }
    }
    return resp;
  }

  validateFormatHora(e: any) {
    var keycode = e.keyCode ? e.keyCode : e.which;
    var tecla = String.fromCharCode(keycode).toLowerCase();
    var especiales = [8, 37, 39, 46, 9, 36, 35];

    var tecla_especial = false;
    for (var i in especiales) {
      if (!window.event && e.keyCode == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }

    if ('0123456789:'.indexOf(tecla) == -1 && !tecla_especial) {
      return false;
    }
    return true;
  }

  /** Funcion para validar dos fechas */
  validateFechas(fechaIni: any, fechaFin: any) {
    var bandera = false;
    if (fechaIni >= fechaFin) {
      bandera = true;
    }
    return bandera;
  }

  private async saveRecordContingencia(enviarDatos: any) {
    try {
      this.gestionProductosService
        .updatePeriodoContingencia(enviarDatos)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
            this.translateService.instant('gestion.saveSuccess'),
            'info',
            this.translateService.instant('gestion.codAviso'),
          )
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('Error'),
        this.translateService.instant('gestion.contngenciaFailSave'),
        'error'
      )
    }
  }

  edit() {
    this.modifica = true;
    for (const dato of this.listado) {
      if (dato._checked) {
        this.formContingencia.setValue({
          dia: dato.dia,
          horaIni: dato.horaIni,
          horaFin: dato.horaFin,
          horaCie: dato.horaCierre,
          horaCiePend: dato.horaCierrePend,
          activo: dato.bandActivo === 'A' ? true : false,
        });
        break;
      }
    }
    this.formContingencia.controls['dia'].disable();
  }

  delete() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant('administracion.productos.periodo.leyendaTituloBorrar'),
        this.translateService.instant('administracion.productos.periodo.leyendaBorrar'),
        "confirm"
      ), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        const promises: Promise<any>[] = [];
        for (const dato of this.listado) {
          if (dato._checked) {
            promises.push(
              this.gestionProductosService.deletePeriodo(this.id, dato.dia)
            );
          }
        }
        this.open(
          this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
          this.translateService.instant('gestion.inactivityCorrectly'),
          'info',
          this.translateService.instant('gestion.codAviso'),
        )
        if (promises.length > 0) {
          Promise.all(promises).then((_) => {
            this.getId(this.id);
          });
        }
      }
    });
  }

  /** Funcion para calcular el valor de la hora de cierre */
  calculateHoraCierre(mod: any) {
    var fechaFin = new Date();
    var fechaCierre = new Date();
    this.fechaCierrePend = new Date();
    let horaFin: any = this.formContingencia.controls['horaFin'].value;
    var factorCierreEnv = parseInt(this.factorEnvio);
    var factorCierrePend = parseInt(this.factorPend);

    var camposFin = horaFin.split(':');
    fechaFin.setHours(camposFin[0]);
    fechaFin.setMinutes(camposFin[1]);
    fechaFin.setSeconds(0);
    fechaFin.setMilliseconds(0);

    fechaCierre.setHours(camposFin[0]);
    fechaCierre.setMinutes(camposFin[1]);
    fechaCierre.setSeconds(0);
    fechaCierre.setMilliseconds(0);
    fechaCierre.setTime(fechaCierre.getTime() + (factorCierreEnv * 60 * 1000));
    if (mod !== 'contingencia') {
      this.formContingencia.controls['horaCie'].setValue(
        this.fillCeros(fechaCierre.getHours().toString()) +
        ':' +
        this.fillCeros(fechaCierre.getMinutes().toString())
      );
    }
    this.fechaCierrePend.setHours(fechaCierre.getHours());
    this.fechaCierrePend.setMinutes(fechaCierre.getMinutes());
    this.fechaCierrePend.setSeconds(0);
    this.fechaCierrePend.setMilliseconds(0);
    this.fechaCierrePend.setTime(
      fechaCierre.getTime() + (factorCierrePend * 60 * 1000)
    );
    if (mod === 'contingencia') {
      this.formContingencia.controls['horaCiePend'].setValue(
        this.fillCeros(this.fechaCierrePend.getHours().toString()) +
        ':' +
        this.fillCeros(this.fechaCierrePend.getMinutes().toString())
      );
    }
  }

  /** Funcion para rellenar con ceros un input
   *
   * @param hora Hora de cierre
   */
  fillCeros(hora: any) {
    var posiciones = 2;
    var ceros = '';
    if (hora.length < 2) {
      for (var x = hora.length; x < posiciones; x++) {
        ceros += '0';
      }
    }
    hora = ceros + hora;
    return hora;
  }

  regresarToConsult() {
    this.router.navigate(['/moduloAdministracion', 'gestionProductos']);
  }

  onClickClean() {
    this.modifica = false;
    this.formContingencia.controls['dia'].enable();
    /**Se limpia el formulario*/
    this.formContingencia.reset();
  }

  numChecked(): number {
    return this.listado ? this.listado.filter((x) => x._checked).length : 0;
  }


}