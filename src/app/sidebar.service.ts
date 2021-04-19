import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private active = new BehaviorSubject(true);

  public getActive(): Observable<boolean> {
    return this.active.asObservable();
  }

  public setActive(state: boolean) {
    this.active.next(state);
  }
}
