import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionBancos } from 'src/app/interface/gestionBancosRespuesta.interface';
import { GestionBancosService } from 'src/app/services/administracion/gestion-banco.services';

@Component({
  selector: 'app-modificar-banco',
  templateUrl: './modificar-banco.component.html',
  styleUrls: ['./modificar-banco.component.css']
})
export class ModificarBancoComponent implements OnInit {
  /** variable de control para saber si se realizo el submit del alta */
  submittedAltaBanco = false;
  /** Propiedad para poder guardar o actualizar el banco */
  objBanco: GestionBancos;

  /**
   * @description Formulario para la busqueda de bancos
   * @type {FormGroup}
   * @memberOf ModificarBancoComponent
  */
  altaBancoForm: UntypedFormGroup;

  claveBanco: any
  statusNum: number;

  constructor(
    private fc: FuncionesComunesComponent,
    private formBuilder: UntypedFormBuilder,
    private gestionBancoService: GestionBancosService,
    private router: Router,
    private globals: Globals,
    public dialog: MatDialog,
    private translateService: TranslateService,
) {

    /** Se inicia el formulario de busqueda */
    this.altaBancoForm = this.initializeForm();
  }

  /**
  * Metodo getter para utilziacion y validacion de formulario
  * en la vista
  */
  get formControlBanco() {
    return this.altaBancoForm.controls;
  }

  /**
     * Metodo para poder inicializar el formulario
     */
  private initializeForm() {
    return this.formBuilder.group({
      claveIdentificacion: [''],
      nombre: [''],
      tipoOperacion: [''],
      codTransfer: [''],
      codBic: [''],
      status: true,
      usuario: [''],
      statusConvenioCcbn: ['A'],
    })
  }

  //Inicialización de componentes
  async ngOnInit() {
    this.claveBanco = this.gestionBancoService.getSaveLocalStorage('banco');
    if (this.claveBanco !== null) {
      this.altaBancoForm.patchValue({
        claveIdentificacion: this.claveBanco.claveIdentificacion,
        nombre: this.claveBanco.nombre,
        tipoOperacion: this.claveBanco.tipoOperacion,
        codTransfer: this.claveBanco.codTransfer,
        codBic: this.claveBanco.codBic,
        status: this.claveBanco.status
      });
    }
  }

  /**
  * @description Metodo que se ejecutara al momento de dar click en limpiar
  */
  cleanForm2() {
    /** Se reinicia el formulario de busqueda */
    this.altaBancoForm = this.initializeForm();
  }

  /**
   * Metodo para regresar a la vista de consulta
   * de bancos
  */
  regresarToConsult2() {
    this.router.navigate(['/moduloAdministracion', 'gestionBancos']);
  }

  public async guardar() {
    this.submittedAltaBanco = true;
    /** llenar el objeto con los nuevos valores */
    if (this.altaBancoForm.value.claveIdentificacion === "") {
      this.open(
        this.translateService.instant('traking.consultaComisiones.msjERROR00004Titulo'),
        this.translateService.instant('pantalla.gestionDeBancos.claveObligatoria'),
        'error',
      );
      return;
    }
    if (this.altaBancoForm.value.nombre === "") {
      this.open(
        this.translateService.instant('traking.consultaComisiones.msjERROR00004Titulo'),
        this.translateService.instant('pantalla.gestionDeBancos.nombreObligatorio'),
        'error',
      );
      return;
    }

    if (this.claveBanco === null) {
      const nuevoBanco = this.altaBancoForm.value
      if (nuevoBanco.status === true) {
        this.statusNum = 1
      } else {
        this.statusNum = 0
      }
      this.patchValueD(nuevoBanco, this.statusNum)

      const confirmGuardaBanco = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(this.translateService.instant('administracion.protocolos.confirm.Titulo'),
          this.translateService.instant('administracion.protocolos.confirm.Observacion'), "confirm"), hasBackdrop: true
      });
      confirmGuardaBanco.afterClosed().subscribe(result => {
        if (result) {
          this.guardaBanco();
        }
      });

    } else {
      const update = this.altaBancoForm.value
      if (update.status === true) {
        this.statusNum = 1
      } else {
        this.statusNum = 0
      }
      this.patchValueD(update, this.statusNum)

      const confirmModificaBanco = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(this.translateService.instant('administracion.protocolos.confirm.Titulo'),
          this.translateService.instant('administracion.protocolos.confirm.Observacion'), "confirm"), hasBackdrop: true
      });
      confirmModificaBanco.afterClosed().subscribe(result => {
        if (result) {
          this.modificaBanco();
        }
      });
    }
  }

  async guardaBanco() {
    try {
      await this.gestionBancoService.saveInformacionBanco(this.altaBancoForm.value).then(
        async (result: any) => {
          if (result.code === null) {
            this.open('Error', result.message, 'error');
          } else {
            this.submittedAltaBanco = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translateService.instant('modals.catalogoDin.info'),
              this.translateService.instant('pantalla.gestionDeBancos.AltaOk'),
              'info',
            );
            /** Se hace el redirect a la vista de alta */
            this.regresarToConsult2();
          }
        }
      )
    } catch (e) {
      this.submittedAltaBanco = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('traking.consultaComisiones.msjERROR00004Titulo'),
        this.translateService.instant('pantalla.gestionDeBancos.AltaError'),
        'error',
      );
    }
  }

  async modificaBanco() {
    try {
      await this.gestionBancoService.updateInformacionBanco(this.claveBanco.id, this.altaBancoForm.value).then(
        async (result: any) => {
          if (result.code === '400') {
            this.open('Error', result.message, 'error');
          } else {
            this.submittedAltaBanco = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translateService.instant('modals.catalogoDin.info'),
              this.translateService.instant('pantalla.gestionDeBancos.ModificacionOk'),
              'info',
            );
            /** Se hace el redirect a la vista de alta */
            this.regresarToConsult2();
          }
        }
      )
    } catch (e) {
      this.submittedAltaBanco = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('traking.consultaComisiones.msjERROR00004Titulo'),
        this.translateService.instant('pantalla.gestionDeBancos.ModificacionErr'),
        'error',
      );
    }
  }

  open(titulo: string, contenido: string, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  patchValueD(banco: any, status: any) {
    this.altaBancoForm.patchValue({
      claveIdentificacion: banco.claveIdentificacion,
      nombre: banco.nombre,
      tipoOperacion: banco.tipoOperacion,
      codTransfer: banco.codTransfer,
      codBic: banco.codBic,
      status: status
    });
  }

  /**
      * @description evento que se ejecutara para solo permitir valores
      * numericos
    */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
  }

  /**
   * @description evento que se ejecutara para solo permitir letras, números, comas, espacios y diagonales
 */
  eventParanumerosLetras(event: any) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

  /**
   * @description Evento para solo permitir valores del alphabeto,numeros,
   * punto, espacio y /
   * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
   * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
   * (keycode >= 48 && keycode <= 57) => numeros
   * (keycode) == 46 => point
   * (keycode) == 32 => espacio
   * (keycode) == 44 => coma
   * (keycode == 47) => /
   */
  onlyAlphabeticAndNumbersAndSomeCaracEsp(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
      || charCode == 46 || charCode == 32 || charCode == 44 || (charCode == 47)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  /**
   * @param event Evento Disable
   * @returns la respuesta del evento
   */
  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  /**
  * Función que valida y muestra mensaje individual
  * de cada campo  obligatorio
  */
  validaCadaCampoObligatorio2() {
    var claveIdentificacion = this.altaBancoForm.get('claveIdentificacion')?.value;
    var nombre = this.altaBancoForm.get('nombre')?.value;
    var tipoOperacion = this.altaBancoForm.get('tipoOperacion')?.value;
    if (claveIdentificacion === '') {
      this.open(
        this.translateService.instant('modals.catalogoDin.info'),
        this.translateService.instant('pantalla.gestionDeBancos.claveObligatoria'),
        'info',
      );
    } else if (nombre === '') {
      this.open(
        this.translateService.instant('modals.catalogoDin.info'),
        this.translateService.instant('pantalla.gestionDeBancos.nombreObligatorio'),
        'info',
      );
    } else if (tipoOperacion === '') {
      this.open(
        this.translateService.instant('modals.catalogoDin.info'),
        this.translateService.instant('pantalla.gestionDeBancos.tipoOperacionObligatorio'),
        'info',
      );
    } else {
      this.guardar();
    }
  }

}
