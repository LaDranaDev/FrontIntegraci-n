import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-mtvo-rechazo',
  templateUrl: './modal-mtvo-rechazo.component.html',
  styleUrls: ['./modal-mtvo-rechazo.component.css'],
})
export class ModalMtvoRechazoComponent implements OnInit {
  mtvoRechazo: any = "";
  img: string = "/assets/img/alerts/informacion.gif";
  typeTitle: string = "";
  color: string = "#0071F8";

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalMtvoRechazoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanCorreoComponents,
  ) { }

  ngOnInit() {
  }

  async accept() {
    if (this.mtvoRechazo) {
      this.mtvoRechazo = this.mtvoRechazo.substring(0, 100);
      this.dialogRef.close(this.mtvoRechazo);
    }
  }

  /**
  * Metodo para levantar el modal para
  * mostrar los mensajes de sucess o error
  * 
  * @param titulo indica si se ejecutara para error o success
  * @param contenido mensaje que se mostrara en el modal
  */
  showModalMsg(
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
