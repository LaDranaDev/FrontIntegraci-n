import { NgModule } from '@angular/core';
import { CurrencyInputDirective } from './currency-input.directive';
import { CustomCurrencyDirective } from './customCurrency.directive';

@NgModule({
  declarations: [CurrencyInputDirective, CustomCurrencyDirective],
  exports: [CurrencyInputDirective, CustomCurrencyDirective]
})
export class CurrencyInputModule {}