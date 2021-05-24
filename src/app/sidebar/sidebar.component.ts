import {Component} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  active = 'ABOUT';
  options = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'SKILLS'];
  myFaces = ['assets/myFace/myFace1.jpg', 'assets/myFace/myFace2.png', 'assets/myFace/myFace3.jpg', 'assets/myFace/myFace4.png'];
  constructor() { }
}
