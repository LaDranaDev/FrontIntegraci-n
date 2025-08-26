import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-modal-enviar-correo',
  templateUrl: './modal-enviar-correo.component.html',
  styleUrls: ['./modal-enviar-correo.component.css'],
})
export class ModalEnviarCorreoComponent implements OnInit {
  correo: any;
  registerForm: FormGroup;
  constructor(
    private monitor: MonitorOperacionesService,
    public dialog: MatDialog,
    private globals: Globals,
    private formBuilder: FormBuilder,
    private fc: FuncionesComunesComponent,
    public dialogRef: MatDialogRef<ModalEnviarCorreoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanCorreoComponents,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  async accept() {
    if (this.registerForm.invalid) {
      this.open(
        this.translateService.instant('notificaciones.msjTRA006Titulo'),
        this.translateService.instant('notificaciones.msjTRA006Observacion'),
        'info',
        this.translateService.instant('notificaciones.msjTRA006Codigo'),
        this.translateService.instant('notificaciones.msjTRA006Sugerencia')
      );
      return;
    } else {
      this.data.data.correo = this.registerForm.value.email;
      this.dialogRef.close();
      try {
        console.log("Export: " + this.data.data.oper);
        if(this.data.data.oper === "exp"){
          await this.monitor
            .generaXMLExpMon(this.data.data)
            .then(async (respuesta: any) => {
              this.globals.loaderSubscripcion.emit(false);
              if (respuesta.error == 'ER00000') {
                this.open('Error', respuesta.message, 'error', respuesta.error);
              } else {
                this.open('INFO', respuesta.message, 'info');
              }
            });
        }else{
          await this.monitor
            .generarXML(this.data.data)
            .then(async (respuesta: any) => {
              this.globals.loaderSubscripcion.emit(false);
              if (respuesta.error == 'ER00000') {
                this.open('Error', respuesta.message, 'error', respuesta.error);
              } else {
                this.open('INFO', respuesta.message, 'info');
              }
            });
        }
      } catch (e) {
        this.open('Error', 'Error al generar el XML', 'error');
      }
    }
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
      hasBackdrop: true 
    });
  }
  /**
   *
   * @Description Metodo para puros numeros
   */
  correoValidar(event: KeyboardEvent) {
    this.fc.numberOnly(event);
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
}
