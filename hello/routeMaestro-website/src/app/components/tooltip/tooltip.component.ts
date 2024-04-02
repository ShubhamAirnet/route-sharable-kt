// tooltip.component.ts
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() showTooltip: boolean;
  @Input() position: { top: string; left: string };
  @Output() mouseEnterTooltip = new EventEmitter<number>(); // Emit the index

  @ViewChild('tooltipContent') tooltipContent: ElementRef;

  tooltipCloseTimeout: any;

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(): void {
    // Emit an event to the parent when the mouse enters the tooltip body
    this.mouseEnterTooltip.emit();
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(): void {
    // Delay closing the tooltip to allow the cursor to move from trigger to tooltip
    this.setTooltipCloseTimeout();
  }

  private setTooltipCloseTimeout(): void {
    // Close the tooltip after a delay
    this.tooltipCloseTimeout = setTimeout(() => {
      this.showTooltip = false;
    }, 600); // Adjust the delay as needed
  }
}
