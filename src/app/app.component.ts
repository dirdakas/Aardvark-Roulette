import { Component, OnInit } from '@angular/core';

import data from './data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Aardvark-Roulette';
  data;

  ngOnInit(): void {
    this.data = data;
    this.getMeResult(null, this.data);
  }

  getMeResult(parent, node): void {
    let pr = parent ? parent : node.name;
    if (!parent && node.nodes.length > 0) {
      console.log(pr + ' ' + node.size);
    }

    if (node.nodes.length > 0) {
      for (const nd of node.nodes) {
        pr = pr + ' - ' + nd.name;
        console.log(pr  + ' ' + nd.size);
        this.getMeResult(pr, nd);
      }
    }
  }
}
