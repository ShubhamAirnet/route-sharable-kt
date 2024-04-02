import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-package-fare-summary',
  templateUrl: './package-fare-summary.component.html',
  styleUrls: ['./package-fare-summary.component.scss']
})
export class PackageFareSummaryComponent implements OnInit {

  @Input() publishedFareFlight;

  constructor() { }

  ngOnInit(): void {
  }

}
