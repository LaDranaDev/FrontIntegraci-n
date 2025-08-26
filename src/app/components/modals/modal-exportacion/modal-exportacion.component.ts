import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-exportacion',
  templateUrl: './modal-exportacion.component.html',
  styleUrls: ['./modal-exportacion.component.css']
})
export class ModalExportacionComponent {

  constructor(public dialogRef: MatDialogRef<ModalExportacionComponent>) { }

  /***Funcion: realiza la peticion de la exportacion */
  exportar(formato: string){
    this.dialogRef.close(formato);
  }

}
