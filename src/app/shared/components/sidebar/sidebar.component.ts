import { Component, inject } from '@angular/core';
import { GifsService } from 'src/app/gifs/services/gifs.service';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private gifsServices = inject(GifsService);

  get histories() {
    return this.gifsServices.tagsHistory;
  }

  selectedOption(value:string):void {
    this.gifsServices.searchTag(value);
  }
}
