import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  private actionStartObs = new BehaviorSubject<{}>({});
  actionObservable$ = this.actionStartObs.asObservable();
  private actions: any;

  constructor() { 
    this.actionStartObs.next([]);
  }

  changeStatusMenu(response: any){
    this.actions = {
      response: response, };
      this.actionStartObs.next(this.actions);
    }
  
}

