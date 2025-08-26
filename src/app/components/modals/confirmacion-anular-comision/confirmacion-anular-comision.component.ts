import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ConsultasComisionesService } from 'src/app/services/consultas-comisiones.service';

@Component({
  selector: 'app-confirmacion-anular-comision',
  templateUrl: './confirmacion-anular-comision.component.html',
  styleUrls: ['./confirmacion-anular-comision.component.css']
})
export class ConfirmacionAnularComisionComponent implements OnInit {

  img: string;
  typeTitle: string;
  color: string;
  code: string;
  cont: string;
  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmacionAnularComisionComponent>,
    private service: ConsultasComisionesService,
  ) { 
    
  }
  ngOnInit(): void {
    this.globals.loaderSubscripcion.emit(false);
    this.delegateType();
  }

  delegateType(){
    this.img = '/assets/img/alerts/ayuda.gif';
    this.typeTitle = "¿Está Seguro que Desea Anular el cobro de Comisión?";
    this.cont = "Número de elementos a Modificar"
    this.code = 'COM001'
    this.color = "#1DA8AF";
  }

  accept() {
    const ids = this.data?.data?.map((i: any) => i.idDetalle);
    this.dialogRef.close({success: true})

    this.service.anularCobroComisionIds(ids).finally(
      () => {
        this.globals.loaderSubscripcion.emit(false)
      }
    )
  }

}
