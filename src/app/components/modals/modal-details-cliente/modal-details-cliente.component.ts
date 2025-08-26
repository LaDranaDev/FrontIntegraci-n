import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/open-roads/clientes.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
@Component({
  selector: 'app-modal-details-cliente',
  templateUrl: './modal-details-cliente.component.html',
  styleUrls: ['./modal-details-cliente.component.css']
})
export class ModalDetailsClienteComponent {
  id!:number;
  nombre!: string ;
  descripcion!: string ;
  identificador!: number;

   constructor(public modalRef: MdbModalRef<ModalDetailsClienteComponent>,
   public dataService: ClientesService) { }
   panelOpenState = false;


  onCancelClick(): void {
    this.modalRef.close();
  }

  onAcceptClick(): void {
    this.modalRef.close(true);
  }
  stopEdit(): void {
    this.dataService.detailsClients(this.id,this.nombre,this.descripcion,this.identificador);
  }

}
