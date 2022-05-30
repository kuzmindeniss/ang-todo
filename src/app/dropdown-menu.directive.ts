import { Directive, ElementRef } from '@angular/core';
import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, sequence, style } from '@angular/animations';
import { ThisReceiver } from '@angular/compiler';

@Directive({
  selector: '[appDropdownMenu]'
})
export class DropdownMenuDirective {
  list: HTMLUListElement | null = null;
  title: HTMLDivElement | null = null;
  isExpanded: boolean = false;
  listPlayer?: AnimationPlayer;

  constructor(
    private el: ElementRef<HTMLDivElement>,
    private animationBuilder: AnimationBuilder  
  ) {
    
  }

  ngOnInit() {
    this.title = this.el.nativeElement.querySelector<HTMLDivElement>(".dropdown-menu__choosed");
    this.list = this.el.nativeElement.querySelector<HTMLUListElement>(".dropdown-menu__list");
    this.list!.style.height = '0px';

    this.list?.addEventListener('click', event => this.setTitle(event))

    this.title?.addEventListener('click', this.toggle);
  }

  setTitle(event: MouseEvent) {
    const target = event.target as HTMLElement;

    let parent = target.parentElement;
    let item = target;

    let isTargetLi = false;
    while (parent) {
      if (item.classList.contains('dropdown-menu__item')) {
        isTargetLi = true;
        break;
      };
      item = parent;
      parent = item.parentElement;
    }

    if (isTargetLi) {
      this.title!.innerHTML = item.innerHTML;
      this.list?.querySelector('.dropdown-menu__item--selected')?.classList.remove('dropdown-menu__item--selected');
      item.classList.add('dropdown-menu__item--selected');
    }
  }

  toggle = () => {
    if (!this.el.nativeElement.classList.contains('dropdown-menu--expanded')) {
      this.isExpanded = true;
      this.el.nativeElement.classList.add('dropdown-menu--expanded');
    } else {
      this.isExpanded = false;
      this.el.nativeElement.classList.remove('dropdown-menu--expanded');
    }


    if (this.listPlayer) this.listPlayer.destroy();
    const metadata = !this.isExpanded ? this.fadeOut() : this.fadeIn();
    const factory = this.animationBuilder.build(metadata);
    const player = factory.create(this.list);
    player.play();
  }

  private fadeIn(): AnimationMetadata[] {
    return [
      style({
        opacity: 0,
        height: '0px',
      }),
      animate('200ms ease-in', style({
        opacity: 1,
        height: 'auto'
      })),
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({
        opacity: '1',
        height: 'auto'
      }),
      animate('200ms ease-in', style({
        opacity: 0,
        height: '0px',
      })),
    ];
  }

}
