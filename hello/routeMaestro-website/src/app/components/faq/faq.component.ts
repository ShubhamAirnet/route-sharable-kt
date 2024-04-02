import { Component, OnInit,Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        height: '0px',
      })),
      transition('void <=> *', animate(300)),
    ]),
  ],
})
export class FaqComponent implements OnInit {


    @Input() question:string;

    @Input() answer:string;



   // Use properties to track the visibility of the answer
   isAnswerVisible = false;

   // Toggle the visibility of the answer
   toggleAnswer() {
     this.isAnswerVisible = !this.isAnswerVisible;
   }



  ngOnInit(): void {
  }

}
