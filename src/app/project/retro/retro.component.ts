import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RetroService } from 'src/app/services/retro.service';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.less'],
})
export class RetroComponent implements OnInit {
  private projectId: number;
  public retro;
  constructor(private activatedRoute: ActivatedRoute, private retroService: RetroService) {}

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.retroId) {
        this.projectId = params.id;
        this.getRetro(params.retroId);
      }
    });
  }

  public getRetro(id: number) {
    this.retroService.read(this.projectId, id).subscribe((retro) => {
      this.retro = retro;
    });
  }
}
