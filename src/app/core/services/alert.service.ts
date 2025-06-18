import { Injectable ,signal} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertMessage {
  message: string ;
  type: 'success' | 'error' |'warning'| 'info';
  duration?: number;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _alert = signal<AlertMessage | null>(null);
  readonly alert = this._alert.asReadonly();

  show(message: string | any, type: ('success' | 'error' |'warning'| 'info') = 'info', duration = 3000,timestamp: number = Date.now()) {
    this._alert.set({ message, type, duration,timestamp });
    const newAlert: AlertMessage = {
      message,
      type,
      duration,
      timestamp: Date.now()
    };
     this._alert.set(null);
    setTimeout(() => this._alert.set(newAlert), 0);
  }
  clear() {
    this._alert.set(null);
  }
}
