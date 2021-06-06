import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{
  active = 'ABOUT';
  previous = '';
  options = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'SKILLS'];
  myFaces = ['assets/myFace/myFace1.jpg', 'assets/myFace/myFace2.png', 'assets/myFace/myFace3.jpg', 'assets/myFace/myFace4.png'];
  constructor(public sidebarService: SidebarService) { }
  ngOnInit() {
    this.previous = this.active;
  }
  goBackCheck(route: string) {
    if (window.innerWidth <= 992 && route === this.previous) {
      this.sidebarService.setActive(false);
    }
    this.previous = this.active;
  }
}
