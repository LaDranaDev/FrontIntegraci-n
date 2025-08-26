import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent  implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoBeanComponents) { }

  ngOnInit() {
  }
  
  accept(){
    this.dialogRef.close("ok");
  }
}
