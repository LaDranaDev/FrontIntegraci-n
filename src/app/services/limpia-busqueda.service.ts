import { Injectable, Output,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LimpiaBusquedaService {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  vacia(): void{
    this.change.emit(true);
  }
}