import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from '../../services/datepicker.service';
import { OperativaHeaderComponent } from '../../components/operativa-header/operativa-header.component';
import { BusquedaClienteComponent } from '../../components/busqueda-cliente/busqueda-cliente.component';
import { InputMaskDirective } from '../../components/input-mask.directive';
import { FuncionesComunesComponent } from '../../components/funciones-comunes.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  MatCheckboxModule,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalExportacionComponent } from '../../components/modals/modal-exportacion/modal-exportacion.component';
import { InputWasDisabled } from 'src/app/directivas/disabledInput.directive';
import { ModalGuardarParametriaAdicionalComponent } from '../../components/modals/modal-guardar-parametria-adicional/modal-guardar-parametria-adicional.component';
import { ModalGuardarParametriaAdicionalDosComponent } from 'src/app/components/modals/modal-guardar-parametria-adicional-dos/modal-guardar-parametria-adicional-dos.component';
import { ModalProductosConfirmingComponent } from 'src/app/components/modals/modal-productos-confirming/modal-productos-confirming.component';

@NgModule({
  declarations: [
    InputMaskDirective,
    InputWasDisabled,
    OperativaHeaderComponent,
    BusquedaClienteComponent,
    ModalExportacionComponent,
    ModalGuardarParametriaAdicionalComponent,
    ModalGuardarParametriaAdicionalDosComponent,
    ModalProductosConfirmingComponent
  ],
  imports: [
    PaginationModule,
    BsDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
  ],
  exports: [
    PaginationModule,
    BsDatepickerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatPaginatorModule,
    InputMaskDirective,
    InputWasDisabled,
    BusquedaClienteComponent,
    OperativaHeaderComponent,
    FormsModule,
    TranslateModule,
    NgbModule,
    ReactiveFormsModule,
    ModalExportacionComponent,
    MatCardModule,
    MatIconModule,
    ModalGuardarParametriaAdicionalComponent,
    ModalGuardarParametriaAdicionalDosComponent,
    ModalProductosConfirmingComponent
  ],
  providers: [
    FuncionesComunesComponent,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'warn' } },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'warn' } },
  ],
})
export class CustomModule {}
