import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage: any = HomePage;

  constructor(private platform: Platform) {}

  async ngOnInit(): Promise<void> {
    await this.platform.ready();
  }
}

