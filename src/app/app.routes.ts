import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormularioComponent } from './components/formulario/formulario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Esto te manda al login apenas abres la página
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: FormularioComponent },
  { path: '**', redirectTo: 'login' }
];