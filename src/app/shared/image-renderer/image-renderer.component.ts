import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-renderer',
  templateUrl: './image-renderer.component.html',
  styleUrls: ['./image-renderer.component.scss']
})
export class ImageRendererComponent implements OnInit {
  @Input() value: any;
  constructor() {
  }

  ngOnInit(): void {
  }

}
