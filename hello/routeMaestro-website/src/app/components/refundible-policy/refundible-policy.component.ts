import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-refundible-policy',
  templateUrl: './refundible-policy.component.html',
  styleUrls: ['./refundible-policy.component.scss']
})
export class RefundiblePolicyComponent implements OnInit {
  @Input() privacyDialog:boolean;
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }
  close(){
    this.closeDialog.emit()
  }
}
