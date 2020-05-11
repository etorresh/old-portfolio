import { Component} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  active = 'ABOUT';
  options = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'EDUCATION'];
  constructor() { }
}
