import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyFooterComponent } from './my-footer/my-footer.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomModule } from './custom/custom.module';

import {MatSidenavModule} from '@angular/material/sidenav'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [LayoutComponent, MenuComponent, MyFooterComponent, HeaderComponent, LoaderComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    HttpClientModule,
    CustomModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule

  ]
})
export class LayoutModule { }
