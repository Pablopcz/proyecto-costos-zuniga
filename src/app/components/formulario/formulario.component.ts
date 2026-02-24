import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
  proyectos$!: Observable<any[]>;

  ngOnInit() {
    this.proyectos$ = this.proyectosService.getProyectos();
    google.charts.load('current', { 'packages': ['corechart'] });
    this.proyectos$.subscribe(datos => {
      if (datos && datos.length > 0) {
        google.charts.setOnLoadCallback(() => this.dibujarGraficas(datos));
      }
    });
  }

  // --- LÓGICA DE CÁLCULOS PARA LA TABLA ---
  
  calcularVariacion(p: any): number {
    return (p.horasReales - p.horasEstimadas) * p.costoHora;
  }

  obtenerEstado(p: any) {
    const v = this.calcularVariacion(p);
    if (v > 0) return { texto: 'Sobrecosto', clase: 'bg-danger', emoji: '🚩' };
    if (v < 0) return { texto: 'Ahorro', clase: 'bg-success', emoji: '💰' };
    return { texto: 'A punto', clase: 'bg-primary', emoji: '✅' };
  }

  // --- MÉTODOS DE ACCIÓN ---

  guardar() {
    if (this.proyecto.nombre) {
      this.proyectosService.guardarProyecto(this.proyecto);
      this.proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
    }
  }

  eliminar(id: string) {
    if (confirm('¿Deseas eliminar este registro?')) {
      this.proyectosService.eliminarProyecto(id);
    }
  }

  dibujarGraficas(datos: any[]) {
    const dataBarras = new google.visualization.DataTable();
    dataBarras.addColumn('string', 'Proyecto');
    dataBarras.addColumn('number', 'Estimado');
    dataBarras.addColumn('number', 'Real');

    datos.forEach(p => {
      dataBarras.addRow([p.nombre || 'S/N', (p.horasEstimadas * p.costoHora), (p.horasReales * p.costoHora)]);
    });

    const optionsBarras = {
      title: 'Estimado vs Real ($)',
      colors: ['#4285f4', '#db4437'],
      chartArea: { width: '70%' },
      legend: { position: 'top' }
    };

    const chartBarras = new google.visualization.ColumnChart(document.getElementById('grafica_barras'));
    chartBarras.draw(dataBarras, optionsBarras);

    const dataLinea = new google.visualization.DataTable();
    dataLinea.addColumn('string', 'Proyecto');
    dataLinea.addColumn('number', 'Costo Real');

    datos.forEach(p => {
      dataLinea.addRow([p.nombre || 'S/N', (p.horasReales * p.costoHora)]);
    });

    const optionsLinea = {
      title: 'Evolución de Costos',
      curveType: 'function',
      legend: { position: 'bottom' },
      colors: ['#4285f4']
    };

    const chartLinea = new google.visualization.LineChart(document.getElementById('grafica_evolucion'));
    chartLinea.draw(dataLinea, optionsLinea);
  }

  salir() {
    if (confirm("¿Seguro que quieres cerrar sesión y volver al inicio?")) {
      this.router.navigate(['/login']);
    }
  }
}