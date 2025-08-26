import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ComunesService } from './comunes.service';

@Injectable({
  providedIn: 'root'
})

export class TimerSessionService {
  private timestart: number = 1800;//1800(30min);
  private timeAlarm: number=300;// 5 min(300)
  private timeLeft: number= this.timestart; // Tiempo inicial en segundos (30 minutos)
  private interval: any;
  private timeLeftSubject = new Subject<{ minutes: number, seconds: number, isLastFiveMinutes: boolean  }>();

  timeLeft$ = this.timeLeftSubject.asObservable();

  startTimer(): void {
    this.updateTime();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.updateTime();
        this.timeLeft--;
        
      } else {
        this.clearTimer();
        this.comunesService.redirect();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  restartTimer(){
    this.clearTimer();
    this.timeLeft = this.timestart;
    this.startTimer();
  }
  private updateTime(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const isLastFiveMinutes = this.timeLeft <= this.timeAlarm;
    this.timeLeftSubject.next({ minutes, seconds,isLastFiveMinutes });
  }
  constructor( private comunesService: ComunesService) { }
}

