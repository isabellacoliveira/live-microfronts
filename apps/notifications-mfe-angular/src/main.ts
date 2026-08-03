import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';

// Notifications MFE Angular.
// Responsabilidade: demonstrar um microfrontend Angular coexistindo com React.
// Quando usar: quando o time já possui Angular e quer evoluir sem reescrever tudo.

@Component({
  selector: 'app-root',
  template: `
    <section style="border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.75rem; background: white;">
      <h3>Notifications MFE</h3>
      <p>Este bloco ilustra a convivência entre Angular e React no mesmo sistema.</p>
    </section>
  `,
})
class AppComponent {}

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
