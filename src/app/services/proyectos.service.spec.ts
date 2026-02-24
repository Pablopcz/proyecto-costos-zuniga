import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  // 1. Conexión a la base de datos (Firestore)
  private firestore = inject(Firestore);
  private proyectosRef = collection(this.firestore, 'proyectos');

  // 2. FUNCIÓN DE LÓGICA Y CÁLCULOS
  async guardarProyecto(datos: any) {
    // Fórmulas matemáticas automáticas:
    const costoEstimado = datos.horasEstimadas * datos.costoHora;
    const costoReal = datos.horasReales * datos.costoHora;
    const variacion = costoReal - costoEstimado;

    // Creamos el "paquete" con los resultados
    const proyectoFinal = {
      nombre: datos.nombre,
      horasEstimadas: datos.horasEstimadas,
      horasReales: datos.horasReales,
      costoHora: datos.costoHora,
      costoEstimado: costoEstimado, // Resultado de la multiplicación
      costoReal: costoReal,           // Resultado de la multiplicación
      variacion: variacion,           // Diferencia
      // Clasificación automática:
      estado: variacion > 0 ? 'Sobrecosto 🚩' : 'Ahorro ✅',
      fecha: new Date().toLocaleString()
    };

    // 3. Enviar a Firebase
    return addDoc(this.proyectosRef, proyectoFinal);
  }

  // Función para leer los datos y graficarlos después
  obtenerProyectos(): Observable<any[]> {
    return collectionData(this.proyectosRef, { idField: 'id' });
  }
}