import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
    selector: 'jw-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss'],
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
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id!: string;
    private element: any;
    isOpen = false;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        document.body.appendChild(this.element);

        this.element.addEventListener('click', (el: any) => {
            if (el.target.classList.contains('jw-modal')) {
                this.close();
            }
        });

        this.modalService.add(this);

        if (localStorage.getItem(`modal-opened-${this.id}`) === 'true') {
            this.open();
        }
    }

    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
        localStorage.removeItem(`modal-opened-${this.id}`);
    }

    open(): void {
        this.element.style.display = 'block';
        this.isOpen = true;
        document.body.classList.add('jw-modal-open');
        localStorage.setItem(`modal-opened-${this.id}`, 'true');
    }

    close(): void {
        this.isOpen = false;
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.classList.remove('jw-modal-open');
        }, 200);
        localStorage.removeItem(`modal-opened-${this.id}`);
    }
}