import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-guardar-parametria-adicional-dos',
  templateUrl: './modal-guardar-parametria-adicional-dos.component.html',
  styleUrls: ['./modal-guardar-parametria-adicional-dos.component.css']
})
export class ModalGuardarParametriaAdicionalDosComponent {

  constructor(public dialogRef: MatDialogRef<ModalGuardarParametriaAdicionalDosComponent>) { }

  /***Funcion: realiza el guardado de la parametria para Chequera de Seguridad */
  guardarParametria(opcionGuardar: string){
    this.dialogRef.close(opcionGuardar);
  }

}
