import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { Observable } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  private proyectosService = inject(ProyectosService);
  proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
  proyectos$!: Observable<any[]>;

  ngOnInit() {
    this.proyectos$ = this.proyectosService.getProyectos();
    google.charts.load('current', {'packages':['corechart']});
    this.proyectos$.subscribe(datos => {
      if (datos && datos.length > 0) {
        google.charts.setOnLoadCallback(() => this.dibujarGraficas(datos));
      }
    });
  }

  async guardar() {
    const costoEstimado = this.proyecto.horasEstimadas * this.proyecto.costoHora;
    const costoReal = this.proyecto.horasReales * this.proyecto.costoHora;
    const variacion = costoReal - costoEstimado;
    const estado = variacion > 0 ? '🚩 Sobrecosto' : '✅ Ahorro';

    const datosFinales = {
      nombreProyecto: this.proyecto.nombre,
      horasEstimadas: this.proyecto.horasEstimadas,
      horasReales: this.proyecto.horasReales,
      costoHora: this.proyecto.costoHora,
      costoEstimado, costoReal, variacion, estado,
      fecha: new Date().toISOString()
    };

    await this.proyectosService.guardarProyecto(datosFinales);
    this.proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
  }

  async eliminar(id: string) {
    if (confirm('¿Deseas eliminar este registro?')) {
      await this.proyectosService.eliminarProyecto(id);
    }
  }

  dibujarGraficas(datos: any[]) {
    const dataBarras = [['Proyecto', 'Estimado', 'Real']];
    const dataLineas = [['Proyecto', 'Costo Real']];
    datos.forEach(p => {
      dataBarras.push([p.nombreProyecto, p.costoEstimado, p.costoReal]);
      dataLineas.push([p.nombreProyecto, p.costoReal]);
    });
    const chartB = new google.visualization.ColumnChart(document.getElementById('grafica_barras'));
    chartB.draw(google.visualization.arrayToDataTable(dataBarras), { title: 'Estimado vs Real ($)' });
    const chartL = new google.visualization.LineChart(document.getElementById('grafica_lineas'));
    chartL.draw(google.visualization.arrayToDataTable(dataLineas), { title: 'Evolución de Costos', curveType: 'function' });
  }
}