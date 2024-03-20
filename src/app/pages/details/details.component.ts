import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import { LineChart } from 'src/app/core/models/LineChart';
import { OlympicService } from 'src/app/core/services/olympic.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  lineChart!: LineChart[];
  country!: string;
  numberOfEntries!: number;
  totalNumberMedals!: number;
  totalNumberOfAthletes!: number;
  windowWidth = window.innerWidth;



  constructor(private olympicService: OlympicService, private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Abonnement au paramMap de la route pour récupérer le paramètre 'country'
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country') ?? '';
      
    });
        
    // Récupération des données spécifiques au pays sélectionné pour le diagramme en ligne
    this.getOlympicsCountry(this.country).subscribe(data => {
      if(data.length === 0){
        this.router.navigateByUrl('/**');
      } else{
        this.lineChart = data;
      }
     
       });
    
    
    // Récupération du nombre total de participations aux JO pour le pays sélectionné
    this.getNumberOfEntries(this.country)
        .subscribe(data => {
          this.numberOfEntries = data;
        });

   
    // Récupération du nombre total de médailles pour le pays sélectionné
    this.getTotalNumberMedals(this.country)
        .subscribe(data =>{
          this.totalNumberMedals = data   
        });  

    // Récupération du nombre total d'athlètes pour le pays sélectionné
    this.getTotalNumberOfAthletes(this.country)
        .subscribe(data =>{
          this.totalNumberOfAthletes = data   
        });  
  }

  
  // Récupération des données spécifiques au pays sélectionné pour le diagramme en ligne
  getOlympicsCountry(countryName: string): Observable<LineChart[]> {
  return this.olympicService.getOlympics().pipe(
    map(olympicsLine => 
      olympicsLine
        .filter(olympic => olympic.country === countryName)
        .map(olympic => ({
          name: olympic.country,
          series : olympic.participations.map(participationObject => ({name: String(participationObject.year), value: participationObject.medalsCount}))
        }))
    )
  );
  }


   // Récupération du nombre total de participations aux JO pour le pays sélectionné
  getNumberOfEntries( country : string): Observable<number>{
    return this.olympicService.getOlympics().pipe(
      filter(olympics => olympics.some(olympic => olympic.country === country) ),
      mergeMap(olympics => olympics.map(olympic => olympic.participations)),
      map(participations => participations.length)
    )
  }
  

  // Récupération du nombre total de médailles pour le pays sélectionné
  getTotalNumberMedals(country: string): Observable<number> {
    return this.olympicService.getOlympics().pipe(
      map(olympics => {
        const olympic = olympics.find(olympic => olympic.country === country);
        return olympic ? olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0) : 0;
      })
    );
  }

  // Récupération du nombre total d'athlètes pour le pays sélectionné
  getTotalNumberOfAthletes(country: string): Observable<number> {
    return this.olympicService.getOlympics().pipe(
      map(olympics => {
        const olympic = olympics.find(olympic => olympic.country === country);
        return olympic ? olympic.participations.reduce((acc, participation) => acc + participation.athleteCount, 0) : 0;
      })
    );
  }


  
  goHome(): void {
    this.router.navigateByUrl('');
  }
}
