
import { Component, Input, OnInit,ElementRef,Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { TooltipService } from './tooltip.service';
@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent implements OnInit,AfterViewInit {

   @Input() text = '';
  x = 0;
  y = 0;
  visible = false;

  constructor(private elRef: ElementRef,private tooltipService:TooltipService  ) {}

  ngAfterViewInit(): void {
    this.tooltipService.register(this); // ✅ this là TooltipComponent
  }
  ngOnInit() {
    document.addEventListener('mousemove', this.updatePosition);
  }

  show(text: string) {
    this.text = text;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  updatePosition = (event: MouseEvent) => {
    const offset = 12;
    const tooltipEl = this.elRef.nativeElement.querySelector('.tooltip');
    const tooltipWidth = tooltipEl?.offsetWidth || 150;
    const tooltipHeight = tooltipEl?.offsetHeight || 40;

    let posX = event.pageX + offset;
    let posY = event.pageY + offset;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Nếu tooltip tràn sang phải -> hiển thị sang trái
    if (posX + tooltipWidth > screenWidth) {
      posX = event.pageX - tooltipWidth - offset;
    }

    // Nếu tooltip tràn xuống dưới -> hiển thị lên trên
    if (posY + tooltipHeight > screenHeight) {
      posY = event.pageY - tooltipHeight - offset;
    }

    this.x = posX;
    this.y = posY;
  };
}
