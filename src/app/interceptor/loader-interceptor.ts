/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * loader-interceptor.ts
 * Control de versiones:
 * Version  Date/Hour      By                         Company     Description
 * -------  ----------     -----------------------    --------    --------------------------------------------------------
 * 1.0      07/04/2020     Isaac Jesus Romero Cruz    TATA SFW    Intercepta las peticiones para controlar el spinner
 */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from '../bean/modal-info-bean.component';
import { Globals } from '../bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { TimerSessionService } from '../services/timer-session.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor{

     /**
     * Constructor del Interceptor
     * @param loaderService Servicio para el control del spinner
     * @param globals Propiedades comunes en la aplicacion
     */
     constructor(private globals: Globals,public dialog: MatDialog, private timer: TimerSessionService ) { }
     /**
      * Implementacion de intercept
      * @param req Peticion actual, contiene informacion de la peticion en curso
      * @param next Handler de la peticion
      */
     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /** Incrementa en una unidad */
        this.globals.requestCount++;
        /** Indica que se ha realizado una peticion (Para mostrar el Spinner) */
        this.globals.loaderSubscripcion.emit(true);
        this.timer.restartTimer();
        return next.handle(req).pipe(
            catchError(error => {
                let errorMessage = '';
                switch (error.status) {
                    case 500:
                    case 400:
                        //this.open('Error',error.error.status);
                        break;
                    default:
                        //this.open('Error',error.message)
                        break;
                }
                if (error instanceof ErrorEvent) {
                  // client-side error
                  errorMessage = `Client error: ${error.error.message}`;
                } else {
                  // backend error
                  errorMessage = `Server error: ${error.status} ${error.message}`;
                }
                // Muestra el error en alguna parte fija de la pantalla.
                return throwError(errorMessage);
              }),
            finalize(() => {
                /** AL finalizar la peticion actual, se elimina en uno el contador global */
                this.globals.requestCount--;
                /** Si ya no hay peticiones que se esten procesando */
                if (this.globals.requestCount === 0) {
                    /** Se indica que debe esconderse el spinner */
                    this.globals.loaderSubscripcion.emit(false);
                }
            })
        );
    }

    open(titulo:String,contenido:String){
      /** Se indica que debe esconderse el spinner */
      //this.globals.loaderSubscripcion.emit(false);
                
        const dialogo = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(titulo,contenido), hasBackdrop: true }
          );
      }
}
