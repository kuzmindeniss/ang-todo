import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PopperService } from './popper.service';

@Component({
  selector: 'popper',
  templateUrl: './popper.component.html',
  styleUrls: ['./popper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('openClose', [
      state('true', style({
        opacity: '*',
      })),
      state('false', style({
        opacity: '0',
        'box-shadow': 'none',
        'height': '0',
      })),
      transition('false <=> true', animate(200))
    ])
  ],
})
export class PopperComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  private element: any;
  isOpen = false;

  constructor(
    private popperService: PopperService,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    this.element.addEventListener('click', (el: any) => {
      if (el.target.classList.contains('popper')) {
        this.close();
      }
    });

    this.popperService.add(this);

    if (localStorage.getItem(`popper-opened-${this.id}`) === 'true') {
      this.open();
    }
  }

  ngOnDestroy(): void {
    this.popperService.remove(this.id);
    this.element.remove();
    localStorage.removeItem(`popper-opened-${this.id}`);
  }

  open(): void {
    console.log('open()');
    this.element.style.display = 'block';
    this.isOpen = true;
    document.body.appendChild(this.element);
    document.body.classList.add('popper-open');
    localStorage.setItem(`popper-opened-${this.id}`, 'true');
  }

  close(): void {
    this.isOpen = false;
    setTimeout(() => {
      this.element.style.display = 'none';
      this.element.remove();
      document.body.classList.remove('popper-open');
    }, 200);
    localStorage.removeItem(`popper-opened-${this.id}`);
  }
}
