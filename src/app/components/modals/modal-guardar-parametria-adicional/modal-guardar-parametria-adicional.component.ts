import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-guardar-parametria-adicional',
  templateUrl: './modal-guardar-parametria-adicional.component.html',
  styleUrls: ['./modal-guardar-parametria-adicional.component.css']
})
export class ModalGuardarParametriaAdicionalComponent {

  constructor(public dialogRef: MatDialogRef<ModalGuardarParametriaAdicionalComponent>) { }

  /***Funcion: realiza el guardado de parametrias con clave de rastreo y cliente VIP */
  guardarParametria(opcionGuardar: string){
    this.dialogRef.close(opcionGuardar);
  }

}
