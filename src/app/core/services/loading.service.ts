import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = new BehaviorSubject<boolean>(false);

  setLoading(loading: boolean): void {
    this.isLoading.next(loading);
  }

  getLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
} 