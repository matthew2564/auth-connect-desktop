import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication.provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string = null;

  constructor(
    public navCtrl: NavController,
    private authProvider: AuthenticationProvider) {
  }

  login = async (): Promise<void> => {
    await this.authProvider.initialiseAuthentication();
    const authenticated: boolean = await this.authProvider.isAuthenticated();

    if (authenticated) {
      await this.onSuccessfulAuth();
    }
    else if (!authenticated && window.navigator.onLine) {
      try {
        await this.authProvider.login();
        await this.onSuccessfulAuth();
      } catch (error) {
        console.error('Login error', error);
      }
    } else {
      console.error('****** OFFLINE ******');
    }
  }

  logout = async (): Promise<void> => {
    try {
      this.username = null;
      await this.authProvider.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      await this.login();
    }
  }

  onSuccessfulAuth = async () => {
    this.username = await this.authProvider.getUsername();
    await this.navCtrl.push('SuccessPage');
  }

}
