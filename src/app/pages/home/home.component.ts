import { Component, HostListener, OnInit } from '@angular/core';
import { Observable, map, mergeMap, of, take } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { PieChart } from 'src/app/core/models/PieChart';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color,  ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Observable pour stocker les données des Jeux Olympiques
  public olympics$: Observable<Olympic[]> = of([]);
  // Observable pour stocker les données du diagramme en secteurs
  pie$ : Observable<PieChart[]> = of ([]);
  numberOfJos!: number;
  numberOfCountries!: number;
  windowWidth = window.innerWidth;

  constructor(private olympicService: OlympicService,
              private router : Router) {}

  ngOnInit(): void {
    // Récupération des données des Jeux Olympiques
    this.olympics$ = this.olympicService.getOlympics();

    // Récupération des données pour le diagramme en secteurs
    this.getPie().subscribe((data: PieChart[])=>{
      this.pie$ = of(data);
    });

     // Récupération du nombre total de participations aux JO 
    this.getTotalJos().subscribe(data=>{
      this.numberOfJos = data;
    });

    // Récupération du nombre total de pays
    this.getTotalCountries().subscribe(data=>{
      this.numberOfCountries = data;
    })
  
  }

  // Fonction pour obtenir le nombre total de participations aux JO
  getTotalJos(): Observable<number> {
    return this.olympicService.getOlympics().pipe(
      mergeMap(olympics => olympics.map(olympic => olympic.participations.length))
    );
  }

  // Récupération du nombre total de pays
  getTotalCountries(): Observable<number>{
    return this.olympicService.getOlympics().pipe(
      mergeMap(olympics => olympics.map(olympic => olympic.country.length))
    );
  }

  // Fonction pour préparer les données du diagramme en secteurs
  getPie(): Observable<PieChart[]> {
    return this.olympicService.getOlympics().pipe(
      map((olympics: Olympic[]) => {
        return olympics.map((olympic: Olympic) => {
          const totalMedals = olympic.participations.reduce((total: number, participation: Participation) => {
            return total + participation.medalsCount;
          }, 0);
          return { name: olympic.country, value: totalMedals };
        });
      })
    );
  }
  
    // Fonction déclenchée lors du clic sur le diagramme en ligne
  onLineClick(data: any): void {
    const country = data.name;
    this.router.navigate(['/details', country]);
    
  }

  // Définition d'une fonction nommée colorPie qui retourne un objet Color
 public colorPie :Color = {
  name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b8cbe7', '#89a1db', '#793d52', '#9780a1'] 
   }


@HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
  }
  

}
