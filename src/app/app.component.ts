import { Component, OnInit, ViewChild } from '@angular/core';
import { Loading, LoadingController, Nav, NavController, Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { AuthenticationProvider, Token } from '../providers/authentication/authentication.provider';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage: any = HomePage;
  @ViewChild(Nav)
  nav: Nav;

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private authProvider: AuthenticationProvider,
    ) {}

  async ngOnInit(): Promise<void> {
    await this.platform.ready();
    await this.authProvider.initialiseAuthentication();
    await this.currentLogin();
  }

  async currentLogin(): Promise<void> {
    const loadingIndicator: Loading = await this.loadingCtrl.create({ content: 'Opening login window...' });
    await loadingIndicator.present();

    // If coming back after logging into Azure and using CURRENT Implicit (web) Login
    if (window.location.hash) {
      // Pass it to Auth Connect
      await this.authProvider.handleLoginCallback(window.location.href, loadingIndicator);
      await this.onSuccessfulAuth();
    } else {
      try {
        await this.authProvider.login(loadingIndicator);
        await this.onSuccessfulAuth();
      } catch (error) {
        console.error(error);
      }
    }
  }

  onSuccessfulAuth = async () => {
    // await this.nav.push('SuccessPage');
    console.log('*** SUCCESS ****');
  }
}

