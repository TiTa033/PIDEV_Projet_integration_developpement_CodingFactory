import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stage } from 'src/stage';
import { StageService } from 'src/stage.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  stages: Stage[] = [];

  constructor(private stageService: StageService, private router: Router) {}

  ngOnInit(): void {
    this.getstages();
  }

  private getstages() {
    this.stageService.getStagesList().subscribe(data => {
      this.stages = data;
    });
  }
}
