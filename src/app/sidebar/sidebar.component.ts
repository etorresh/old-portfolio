import {Component, ViewChild} from '@angular/core';
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  active = 'ABOUT';
  options = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'SKILLS'];
  myFaces = ['assets/myFace/myFace1.jpg', 'assets/myFace/myFace2.png', 'assets/myFace/myFace3.jpg', 'assets/myFace/myFace4.png'];

  @ViewChild('carousel', {static: true}) carousel: NgbCarousel;
  constructor() { }
}
