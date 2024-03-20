import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  // Création d'un BehaviorSubject pour stocker les données des Jeux Olympiques
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

 // Méthode pour charger les données initiales
  loadInitialData() { 
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), 
      catchError((error, caught) => { 
        console.error(error);
        this.olympics$.next([]); 
        return caught; 
      })
    );
  }
// Méthode pour obtenir les données des Jeux Olympiques
  getOlympics(): Observable<Olympic[]>{ 
    return this.olympics$.asObservable().pipe(
      filter(olympics$ => olympics$ && olympics$.length > 0) 
    );
  }
}