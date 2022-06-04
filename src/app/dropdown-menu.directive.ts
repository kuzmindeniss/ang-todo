import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, sequence, style } from '@angular/animations';
import { ProjectService } from './project.service';

@Directive({
  selector: '[appDropdownMenu]'
})
export class DropdownMenuDirective {
  @Input() item?: string;
  @Output() itemChanged = new EventEmitter<string>();

  list: HTMLUListElement | null = null;
  title: HTMLDivElement | null = null;
  isExpanded: boolean = false;
  listPlayer?: AnimationPlayer;
  choosedItemName: string | undefined;

  constructor(
    private el: ElementRef<HTMLDivElement>,
    private animationBuilder: AnimationBuilder,
    private projectService: ProjectService
  ) {
    
  }

  ngOnInit() {
    this.title = this.el.nativeElement.querySelector<HTMLDivElement>(".dropdown-menu__choosed");
    this.list = this.el.nativeElement.querySelector<HTMLUListElement>(".dropdown-menu__list");
    this.list!.style.height = '0px';
    this.el.nativeElement.tabIndex = 1;
    this.el.nativeElement.addEventListener('blur', event => this.close())

    this.list?.addEventListener('click', event => this.setItemOnClick(event))
    this.title?.addEventListener('click', this.toggle);
  }

  setItemOnClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    let parent = target.parentElement;
    let currentItem = target;

    let isTargetLi = false;
    while (parent) {
      if (currentItem.classList.contains('dropdown-menu__item')) {
        isTargetLi = true;
        break;
      };
      currentItem = parent;
      parent = currentItem.parentElement;
    }

    if (isTargetLi) {
      this.title!.innerHTML = currentItem.innerHTML;
      this.list?.querySelector('.dropdown-menu__item--selected')?.classList.remove('dropdown-menu__item--selected');
      currentItem.classList.add('dropdown-menu__item--selected');
      this.toggle();
      this.projectService.newProjectColor = currentItem.querySelector('.dropdown-menu__select-name')!.innerHTML;
      this.choosedItemName = currentItem.dataset['selectionName'];

      this.itemChanged.emit(this.choosedItemName);
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

  close = () => {
    if (!this.isExpanded) return;
    this.isExpanded = false;
    this.el.nativeElement.classList.remove('dropdown-menu--expanded');

    if (this.listPlayer) this.listPlayer.destroy();
    const metadata = this.fadeOut();
    const factory = this.animationBuilder.build(metadata);
    const player = factory.create(this.list);
    player.play();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && !changes['item'].firstChange) {
      const newValue = changes['item'].currentValue;
      const liWithData = this.list?.querySelector(`li[data-selection-name="${newValue}"]`) as HTMLElement;

      this.title!.innerHTML = liWithData.innerHTML;
      this.list?.querySelector('.dropdown-menu__item--selected')?.classList.remove('dropdown-menu__item--selected');
      liWithData.classList.add('dropdown-menu__item--selected');
      setTimeout(() => {
        this.projectService.newProjectColor = liWithData.querySelector('.dropdown-menu__select-name')!.innerHTML;
        this.choosedItemName = liWithData.dataset['selectionName'];
      }, 0);
    }
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
