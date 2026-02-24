import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Necesario para los inputs

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // <-- AGREGADO: Para que funcione el [(ngModel)]
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // 1. Definimos los datos que el usuario va a escribir
  credenciales = {
    usuario: '',
    password: ''
  };

  constructor(private router: Router) {}

  // 2. La función que revisa si los datos son correctos
 entrar() {
    // Actualizamos con tu cédula y la misma clave
    if (this.credenciales.usuario === '16285516' && this.credenciales.password === '1234') {
      
      console.log('✅ Acceso concedido para Pablo');
      this.router.navigate(['/dashboard']);

    } else {
      alert('❌ Error: Cédula o contraseña incorrectos');
    }
  }
}