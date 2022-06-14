import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
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
  @Input() item!: HTMLElement;
  @Output() closeEvent = new EventEmitter<boolean>();
  private element: HTMLDivElement;
  private popperBody!: HTMLDivElement;
  private popperIcon!: HTMLButtonElement;
  isOpen = false;
  popperWidth = 250;


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

    this.popperBody = this.element.querySelector(".popper-body") as HTMLDivElement;
    this.popperIcon = this.item.querySelector(".popper-icon") as HTMLButtonElement;

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
    const popperIconRect = this.popperIcon.getBoundingClientRect();
    const offsetTop = popperIconRect.bottom + window.scrollY;
    const offsetLeft = popperIconRect.right + window.scrollX - (this.popperWidth / 2) - (popperIconRect.width / 2);

    this.popperBody.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    this.element.style.display = 'block';
    this.item.classList.add("left-menu__item-popper-opened");
    this.isOpen = true;
    document.body.appendChild(this.element);
    document.body.classList.add('popper-open');
    localStorage.setItem(`popper-opened-${this.id}`, 'true');
  }

  close(): void {
    this.isOpen = false;
    this.closeEvent.emit(true);
    this.item.classList.remove("left-menu__item-popper-opened");
    setTimeout(() => {
      this.element.style.display = 'none';
      this.element.remove();
      document.body.classList.remove('popper-open');
    }, 200);
    localStorage.removeItem(`popper-opened-${this.id}`);
  }
}
