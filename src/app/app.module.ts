import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Globals } from './bean/globals-bean.component';
import { StateBeanComponent } from './bean/state-bean.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomModule } from './layout/custom/custom.module';
import { ConexionService } from './services/conexion.service';
import { ServicioTransporteDatos } from './services/servicio-transporte.service';
import { DatePipe, CurrencyPipe, APP_BASE_HREF } from '@angular/common';
import { LoaderInterceptor } from './interceptor/loader-interceptor';
import { GlobalErrorHandler } from './error/global-error-handler';
import { ModalInfoComponent } from './components/modals/modal-info/modal-info.component';
import { ModalConfirmacionComponent } from './components/modals/modal-confirmacion/modal-confirmacion.component';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ModalConfirmComponent } from './components/modals/modal-confirm/modal-confirm.component';
import { ModalAddClienteComponent } from './components/modals/modal-add-cliente/modal-add-cliente.component';
import { ModalEditClienteComponent } from './components/modals/modal-edit-cliente/modal-edit-cliente.component';
import { ModalDetailsClienteComponent } from './components/modals/modal-details-cliente/modal-details-cliente.component';
import { ErrorMsgDirective } from 'src/app/directivas/error-msg.directive';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MatIconModule } from '@angular/material/icon'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalSubsidiariaComponent } from './components/modals/modal-subsidiaria/modal-subsidiaria.component';
import { CuentaPagadoraComponent } from './components/modals/modal-tipo-cobro/cuenta-pagadora/cuenta-pagadora.component';
import { CuentaProductoComponent } from './components/modals/modal-tipo-cobro/cuenta-producto/cuenta-producto.component';
import { SubsidiariaComponent } from './components/modals/modal-tipo-cobro/subsidiaria/subsidiaria.component';
import { UnaCuentaComponent } from './components/modals/modal-tipo-cobro/una-cuenta/una-cuenta.component';
import { ModalComprobanteComponent } from './components/modals/modal-comprobante/modal-comprobante.component';
import { ModalSinElementosComponent } from './components/modals/modal-sin-elementos/modal-sin-elementos.component';
import { ModalCuentasBeneficiariasComponent } from './components/modals/modal-cuentas-beneficiarias/modal-cuentas-beneficiarias.component';
import { ModalConfirmacionYNComponent } from './components/modals/modal-confirmacion-y-n/modal-confirmacion-y-n.component';
import { ModalAgregarValidacionCanalComponent } from './components/modals/modal-agregar-validacion-canal/modal-agregar-validacion-canal.component';
import { ModalConfirmacionOCComponent } from './components/modals/modal-confirmacion-oc/modal-confirmacion-oc.component';
import { ModalConfirmacionOkCancelComponent } from './components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';
import { ModalEnviarCorreoComponent } from './components/modals/modal-enviar-correo/modal-enviar-correo.component';
import { ModalSelectItemsComponent } from './components/modals/modal-select-items/modal-select-items.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './layout/CustomPaginatorConfiguration';
import { ModalSeleccionarPaginaComponent } from './components/modals/modal-seleccionar-pagina/modal-seleccionar-pagina.component';
import { ModalSolicitudCambioEstatusComponent } from './components/modals/modal-solicitud-cambio-estatus/modal-solicitud-cambio-estatus.component';
import { ModalMtvoRechazoComponent } from './components/modals/modal-mtvo-rechazo/modal-mtvo-rechazo.component';
import { ModalCuentaCobroComponent } from './components/modals/modal-cuenta-cobro/modal-cuenta-cobro.component';
import { ConfirmacionAnularComisionComponent } from './components/modals/confirmacion-anular-comision/confirmacion-anular-comision.component';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MonitoreoOperacionesComponent } from './pages/monitoreo-api/monitoreo-operaciones/monitoreo-operaciones/monitoreo-operaciones.component';
import { ConsultaTrackingApiComponent } from './pages/monitoreo-api/consulta-tracking-api/consulta-tracking-api/consulta-tracking-api.component';
defineLocale('es', esLocale);


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ModalInfoComponent,
    ModalConfirmacionComponent,
    ModalConfirmComponent,
    ModalAddClienteComponent,
    ModalEditClienteComponent,
    ModalDetailsClienteComponent,
    ErrorMsgDirective,
    ModalSubsidiariaComponent,
    CuentaPagadoraComponent,
    CuentaProductoComponent,
    SubsidiariaComponent,
    UnaCuentaComponent,
    ModalComprobanteComponent,
    ModalSinElementosComponent,
    ModalCuentasBeneficiariasComponent,
    ModalConfirmacionYNComponent,
    ModalAgregarValidacionCanalComponent,
    ModalConfirmacionOCComponent,
    ModalConfirmacionOkCancelComponent,
    ModalEnviarCorreoComponent,
    ModalSelectItemsComponent,
    ModalSeleccionarPaginaComponent,
    ModalSolicitudCambioEstatusComponent,
    ModalMtvoRechazoComponent,
    ModalCuentaCobroComponent,
    ConfirmacionAnularComisionComponent,
    MonitoreoOperacionesComponent,
    ConsultaTrackingApiComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CustomModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NgbModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    HttpClientModule,
    NgbModule,
    MatDatepickerModule,        // <----- import(must)
    MatNativeDateModule,
  ],
  providers: [CurrencyPipe, Globals, StateBeanComponent, ConexionService, ServicioTransporteDatos, DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    //IMPORTANT: this prefij doesn´t afect navigation and routing inside app, It only affects when entering the app
    { provide: APP_BASE_HREF, useValue: '/H2HUsuariosPaaS' },
  ],
    
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: TranslateService, private localeService: BsLocaleService){
    this.translateService.onLangChange.subscribe((r) => {
      this.localeService.use(r.lang);
    });
  }
 }

