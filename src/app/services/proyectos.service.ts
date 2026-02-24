import { Injectable, inject } from '@angular/core';
import { Database, ref, push, listVal, remove } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private db = inject(Database);

  getProyectos() {
    const proyectosRef = ref(this.db, 'proyectos');
    return listVal(proyectosRef, { keyField: 'id' });
  }

  guardarProyecto(datos: any) {
    const proyectoRef = ref(this.db, 'proyectos');
    return push(proyectoRef, datos);
  }

  eliminarProyecto(id: string) {
    const proyectoRef = ref(this.db, `proyectos/${id}`);
    return remove(proyectoRef);
  }
}