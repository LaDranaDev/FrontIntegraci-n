import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientesService } from 'src/app/services/open-roads/clientes.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-add-cliente',
  templateUrl: './modal-add-cliente.component.html',
  styleUrls: ['./modal-add-cliente.component.css'],
})
export class ModalAddClienteComponent {
  constructor(
    public modalRef: MdbModalRef<ModalAddClienteComponent>,
    private dataService: ClientesService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private globals: Globals
  ) {}

  async onAddClient(addForm: NgForm) {
    document.getElementById('add-client-form')?.click();
    await this.dataService.addClient(addForm.value).then(
      (response: any) => {
        this.openModalInfo(
          this.translateService.instant('modal.addCliente.msjInfo0001Titulo'),
          this.translateService.instant(
            'modal.addCliente.msjInfo0001Observacion'
          ),
          'info',
          this.translateService.instant('modal.addCliente.msjInfo0001Codigo'),
          this.translateService.instant(
            'modal.addCliente.msjInfo0001Sugerencia'
          )
        );
        addForm.reset();
        this.globals.loaderSubscripcion.emit(false);
      },
      (error: HttpErrorResponse) => {
        this.openModalInfo(
          this.translateService.instant('modal.addCliente.msjERR0001Titulo'),
          this.translateService.instant(
            'modal.addCliente.msjERR0001Observacion'
          ),
          'error',
          this.translateService.instant('modal.addCliente.msjERR0001Codigo'),
          this.translateService.instant(
            'modal.addCliente.msjERR0001Observacion'
          )
        );
        addForm.reset();
        this.globals.loaderSubscripcion.emit(false);
      }
    );
    this.modalRef.close();
  }

  openModalInfo(
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

  onCancelClick(): void {
    this.modalRef.close();
  }

  onAcceptClick(): void {
    this.modalRef.close(true);
  }
}
