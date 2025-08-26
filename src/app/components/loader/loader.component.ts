import { OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Globals } from '../../bean/globals-bean.component';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit,OnDestroy {
    /* Indica si el componente debe mostrarse */
    show = false;
    /* Subscripcion para saber cuando un componente solicita mostrar el componente loader */
  private subscription: Subscription = new Subscription;

  constructor(private changesDetector: ChangeDetectorRef,private globals: Globals) { }

  ngOnInit(): void {
    this.subscription = this.globals.loaderSubscripcion
      .subscribe((state: boolean) => {
        this.show = state;
        this.changesDetector.detectChanges();
      });
  }
    /* Elimina la subscripcion al Servicio Loader */
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
