import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopperService {
  private poppers: any[] = [];

  constructor() { }

  add(popper: any) {
    this.poppers.push(popper);
  }

  remove(id: string) {
    this.poppers = this.poppers.filter(x => x.id !== id);
  }

  open(id: string) {
    const popper = this.poppers.find(x => x.id === id);
    popper.open();
  }

  close(id: string) {
    const popper = this.poppers.find(x => x.id === id);
    popper.close();
  }
}
