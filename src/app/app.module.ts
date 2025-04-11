import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { LayoutModule } from "@angular/cdk/layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { KeycloakService } from "./back-office/@theme/keycloak/keycloak.service";
import { LoginComponent } from "./login/login.component";
import { ResetpasswordComponent } from "./resetpassword/resetpassword.component";
import { RegisterComponent } from './register/register.component';
import { HttpTokenInterceptor } from "./back-office/@theme/services/interceptor/http-token.interceptor";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { ScrollSpyModule } from 'ngx-scrollspy';
import { CommonModule } from '@angular/common';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BloglistComponent } from './pages/bloglist/bloglist.component';
import { PagesModule } from './pages/pages.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { FilterPipe } from './back-office/@theme/components/card/candidature-back/pipe-filter/filter.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetpasswordComponent,
    ProfileComponent

  ],
  imports: [
    PagesModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    RegisterComponent, // ✅ Standalone component (imported, not declared)
    HeaderComponent,   // ✅ Ensure these components exist
    FooterComponent,
    ScrollToModule.forRoot(), 
    HttpClientModule// Ensure it's registered properly


  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Add this if needed
  bootstrap: [AppComponent]
})
export class AppModule { }
