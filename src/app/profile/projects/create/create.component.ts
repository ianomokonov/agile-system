import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class CreateComponent implements OnInit {
  public projectId: number;

  constructor(private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params.id;
    });
  }
}
