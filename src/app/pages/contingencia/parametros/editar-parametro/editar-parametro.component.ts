import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { IConsultaParametros } from 'src/app/bean/iconsulta-parametros.component';
import { parametrosService } from 'src/app/services/contingencia/parametros.service';

@Component({
  selector: 'app-editar-parametro',
  templateUrl: './editar-parametro.component.html',
  styleUrls: ['./editar-parametro.component.css'],
})
export class EditarParametroComponent implements OnInit {
  /** variable de control para saber si se realizo el submit del alta o edicion */
  submittedParametroAltaEdicion = false;
  /** Variable para poder realiar la validacion para determinar si se deshabilita o no el input de nombre */
  banderaDisabledInputNombre: boolean = true;

  /**
   * @description objeto de parametro para el guardado
   * de la informacion de respaldo
   */
  consultaParametroRespaldo: IConsultaParametros;

  /**
   * @description Formulario para alta y edicion de parametro
   * @type {FormGroup}
   * @memberOf EditarParametroComponent
   */
  formAltaEdicionParametro: UntypedFormGroup;

  /**
   * @description objeto de parametro para la alta
   * @type {IAltaParametro}
   * @memberOf EditarParametroComponent
   */
  altaParametro: any;

  /**
   * @description objeto de parametro para la modificacion
   * @type {IEdicionParametro}
   * @memberOf EditarParametroComponent
   */
  edicionParametro: any;
  /** variable de control para saber si se realizo el submit de edicion */
  submittedParametroEdicion = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private parametroService: parametrosService,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    /** Se crea el formulario para poder validar los campos */
    this.formAltaEdicionParametro = this.formBuilder.group({
      parametro: ['', Validators.required],
      valor: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    /** Se inicializa el objeto de respaldo de la consulta parametro */
    this.consultaParametroRespaldo = {
      id: 0,
      nombre: '',
      valor: '',
      descripcion: '',
      estatus: '',
    };

    /** Se crea el objeto para la alta o edicion del parametro */
    this.altaParametro = {
      nombre: '',
      valor: '',
      descripcion: '',
    };

    /** Se crea el objeto para la modicion del parametro solo se usara
     * para llenarse al momento de ser enviado al sercicio
     */
    this.edicionParametro = {
      descripcion: '',
      valor: '',
    };
  }

  activa:any = false
  ngOnInit(): void {
    /** Se obtiene el objeto guardado en el localstorage */
    this.getOrCreateAltaParametroFromlocal();
  }

  /**
   * Metodo para poder realizar la obtencion del localstorage
   * y determinar si es una actualizacion o inserccion
   */
  getOrCreateAltaParametroFromlocal() {
    /** Se obtiene el valor guardado del localstorage */
    this.consultaParametroRespaldo =
      this.parametroService.getSaveLocalStorage('parametro');

    /** en caso de que exista un parametro guardado en el local accede al if si no accede al else */
    if (this.consultaParametroRespaldo.id > 0) {
      this.activa = true
      this.banderaDisabledInputNombre = true;
      /** Se realizara la actualizacion */
      this.altaParametro.nombre =
        this.consultaParametroRespaldo.nombre.toUpperCase();
      this.altaParametro.valor = this.consultaParametroRespaldo.valor;
      this.altaParametro.descripcion =
        this.consultaParametroRespaldo.descripcion;
    } else {
      this.banderaDisabledInputNombre = false;
      this.activa = false;
      /** Se realizara el guardado */
      (this.altaParametro.nombre = ''), (this.altaParametro.valor = '');
      this.altaParametro.descripcion = '';
    }
  }

  /**
   * Metodo getter para utilziacion y validacion de formulario
   * en la vista
   */
  get formControlParametro() {
    return this.formAltaEdicionParametro.controls;
  }

  /**
   * Metodo para poder realizar el guardado del parametro
   */
  guardarActualizarParametro() {
    this.submittedParametroAltaEdicion = true;

    if (this.consultaParametroRespaldo.id > 0) {
      if (this.validaCampos()) {
        /** Se relaiza el llenado del objeto a actualizar */
        this.fillObjectToUpdateParametro();

        let titulo = this.translate.instant('modals.parametros.confirmacion');
        let contenido = this.translate.instant('modals.parametros.confirmacion.contenido');
        const dialogo = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true
        });
        dialogo.afterClosed().subscribe((result) => {
          if (result) {
            /** Se realiza la actualizacion del parametro */
            this.updateParametro();
          }
        });
      } else {
        this.open(
          this.translate.instant('parametros.editar.titulo'),
          this.translate.instant('parametros.editar.observacion'),
          'error',
          this.translate.instant('parametros.editar.codigo'),
          this.translate.instant('parametros.editar.sugerencia'),
        )
      }
    } else {
      /** Se realiza el guardado del parametro */
      if (this.validaCampos()) {
        let titulo = this.translate.instant('modals.parametros.confirmacion');
        let contenido = this.translate.instant('modals.parametros.confirmacion.contenido');
        const dialogo = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true
        });
        dialogo.afterClosed().subscribe((result) => {
          if (result) {
            /** Se realiza la actualizacion del parametro */
            this.saveParametro();
          }
        });
      } else {
        this.open(
          this.translate.instant('parametros.editar.titulo'),
          this.translate.instant('parametros.editar.observacion'),
          'error',
          this.translate.instant('parametros.editar.codigo'),
          this.translate.instant('parametros.editar.sugerencia'),
        );
      }
    }
  }
  /**
 * 
 * @returns 
 *  parametro: [
      '', Validators.required
    ],
    valor: [
      '', Validators.required
    ],
    descipcion: [
      '', Validators.required
    ]
 */

  validaCampos() {
    var valida = true;
    var v = this.formAltaEdicionParametro.value.valor;
    var d = this.formAltaEdicionParametro.value.descripcion;
    if (v.trimStart() == '') {
      this.altaParametro.valor = '';
      if (d.trimStart() == '') {
        this.altaParametro.descripcion = '';
        return false;
      }
      return false;
    }
    if (d.trimStart() == '') {
      this.altaParametro.descripcion = '';
      if (v.trimStart() == '') {
        this.altaParametro.valor = '';
        return false;
      }
      return false;
    }
    if (this.formAltaEdicionParametro.value.parametro == '') {
      //$('#txtParamParam').focus();
      return false;
    }
    if (this.formAltaEdicionParametro.value.valor == '') {
      //$('#txtValorParam').focus();
      return false;
    }
    if (this.formAltaEdicionParametro.value.descripcion == '') {
      //$('#txtDescripcionParam').focus();
      return false;
    }
    return valida;
  }
  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros, guion
   * y punto
   */
  eveValidateAlphaAndNumAndGuionAndPoint(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbersAndGuionAndPoint(event);
  }

  vali(event: KeyboardEvent) {

    var browserName = navigator.appName;
    var key = (event.charCode) ? event.charCode :
        ((event.keyCode) ? event.keyCode : ((event.which) ? event.which : 0));
    return ((key >= 48 && key <= 57)
        || (key >= 97 && key <= 122)
        || (key >= 65 && key <= 90)
        || key == 46 //.
        || key == 32 // espacio
        || key == 241 //ñ
        || key == 209 //Ñ
        || key == 58 //:
        || key == 64 //@
        || key == 95 //_
        );

}

  /**
   * Evento para poder validar que el campo solo se
   * puedan ingresar alphabeto, numeros, guion, punto
   * espacio, : y arroba
   */
  eveValidateAlphaAndNumAndSomeCaracEsp(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbersAndSomeCaracEsp(event);
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  /**
   * Metodo para regresar a la vista de consulta
   * de parametros
   */
  regresarToConsult() {
    this.router.navigate(['/contingencia', 'parametros']);
  }

  /**
   * Metodo para poder realizar el guardado
   * del parametro
   */
  private async saveParametro() {
    try {
      var v = this.formAltaEdicionParametro.value.valor;
      var d = this.formAltaEdicionParametro.value.descripcion;
      this.formAltaEdicionParametro.value.valor = v.trimStart();
      this.formAltaEdicionParametro.value.descripcion = d.trimStart();
      var envio = {
        nombre: this.altaParametro.nombre.toUpperCase(),
        valor: this.formAltaEdicionParametro.value.valor,
        descripcion: this.formAltaEdicionParametro.value.descripcion,
      };
      await this.parametroService
        .saveParametro(envio)
        .then(async (result: any) => {
          this.submittedParametroAltaEdicion = false;

          this.globals.loaderSubscripcion.emit(false);
          if (result.code == 500) {
            this.open(
              this.translate.instant('modals.parametros.error'),
              this.translate.instant('modals.parametros.registrada'),
              'error'
            );
          }
          if (result.code == null) {
            /** Se hace el redirect a la vista de alta */
            this.parametroService.setShowParametros(true);
            //bandera de seguardo
            this.parametroService.setSaveLocalStorage('guardoAltaParametro', true);
            this.regresarToConsult();
          }
        });
    } catch (e) {
      this.submittedParametroAltaEdicion = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('parametros.edita.msgERR0001titulo'),
        this.translate.instant('parametros.edita.msgERR0001observacion'),
        'error',
        this.translate.instant('parametros.edita.msgERR0001codigo'),
        this.translate.instant('parametros.edita.msgERR0001sugerencia'),
       );
    }
  }

  /**
   * Metodo para poder realizar la actualizacion
   * del parametro
   */
  private async updateParametro() {
    try {
      var v = this.formAltaEdicionParametro.value.valor;
      var d = this.formAltaEdicionParametro.value.descripcion;
      this.formAltaEdicionParametro.value.valor = v.trimStart();
      this.formAltaEdicionParametro.value.descripcion = d.trimStart();
      var envio = {
        nombre: this.altaParametro.nombre.toUpperCase(),
        valor: this.formAltaEdicionParametro.value.valor,
        descripcion: this.formAltaEdicionParametro.value.descripcion,
      };
      await this.parametroService
        .actualizarParametro(envio, this.consultaParametroRespaldo.id)
        .then(async (result: any) => {
          this.submittedParametroAltaEdicion = false;
          this.globals.loaderSubscripcion.emit(false);
          /** Se hace el redirect a la vista de alta */

          this.parametroService.setShowParametros(true);
          this.parametroService.setSaveLocalStorage('guardoUpdateParametro', true);
          this.regresarToConsult();
        });
    } catch (e) {
      this.submittedParametroAltaEdicion = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('parametros.edita.msgERR0003titulo'),
        this.translate.instant('parametros.edita.msgERR0003observacion'),
        'error',
        this.translate.instant('parametros.edita.msgERR0003codigo'),
        this.translate.instant('parametros.edita.msgERR0003sugerencia'),
       );
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
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
      ), hasBackdrop: true
    });
  }

  /**
   * Metodo para poder realizar el llenado
   * del objeto que se enviara a la peticion
   * de actualizacion
   */
  fillObjectToUpdateParametro() {
    this.edicionParametro.descripcion = this.altaParametro.descripcion;
    this.edicionParametro.valor = this.altaParametro.valor;
  }

  /**
   * Metodo para poder realizar el limpiado
   * del formulario y en caso de ser update
   * entonces reasignar los valores por default
   */
  cleanForm() {
    /** Se limpia la bandera que indica si se envio la peticion */
    this.submittedParametroAltaEdicion = false;
    /** Se obtiene el objeto guardado en el localstorage */
    this.getOrCreateAltaParametroFromlocal();
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }
}
