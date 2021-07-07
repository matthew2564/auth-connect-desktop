import { Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication.provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string = null;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private authProvider: AuthenticationProvider) {
    this.currentLogin()
  }

  async currentLogin(): Promise<void> {
  //   const loadingIndicator: Loading = await this.loadingCtrl.create({ content: 'Opening login window...' });
  //   await loadingIndicator.present();
  //
  //   // If coming back after logging into Azure and using CURRENT Implicit (web) Login
  //   if (window.location.hash) {
  //     console.log('******************* HASH', window.location.hash);
  //     // Pass it to Auth Connect
  //     await this.authProvider.handleLoginCallback(window.location.href, loadingIndicator);
  //     await this.onSuccessfulAuth();
  //   } else {
  //     try {
  //       console.log('******************* NOT HASH');
  //       await this.authProvider.login(loadingIndicator);
  //       await this.onSuccessfulAuth();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  }

  // login = async (): Promise<void> => {
  //   await this.authProvider.initialiseAuthentication();
  //   const authenticated: boolean = await this.authProvider.isAuthenticated();
  //
  //   if (authenticated) {
  //     await this.onSuccessfulAuth();
  //   }
  //   else if (!authenticated && window.navigator.onLine) {
  //     try {
  //       await this.authProvider.login();
  //       await this.onSuccessfulAuth();
  //     } catch (error) {
  //       console.error('Login error', error);
  //     }
  //   } else {
  //     console.error('****** OFFLINE ******');
  //   }
  // }

  logout = async (): Promise<void> => {
    try {
      this.username = null;
      await this.authProvider.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      await this.currentLogin();
    }
  }

  onSuccessfulAuth = async () => {
    this.username = await this.authProvider.getUsername();
    await this.navCtrl.push('SuccessPage');
  }

}
