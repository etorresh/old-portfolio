import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './sidebar-content/about/about.component';
import {ExperienceComponent} from './sidebar-content/experience/experience.component';
import {ProjectsComponent} from './sidebar-content/projects/projects.component';
import {SkillsComponent} from './sidebar-content/skills/skills.component';
import {EducationComponent} from './sidebar-content/education/education.component';


const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: 'about', component: AboutComponent},
  {path: 'experience', component: ExperienceComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'skills', component: SkillsComponent},
  {path: 'education', component: EducationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
