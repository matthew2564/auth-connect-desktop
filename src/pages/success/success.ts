import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { VehicleProvider } from '../../providers/vehicle/vehicle.provider';
import { AuthenticationProvider } from '../../providers/authentication/authentication.provider';

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {

  response = null;
  tokenExp = null;

  constructor(
    public vehicleProvider: VehicleProvider,
    private authProvider: AuthenticationProvider,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  getData = async () => {
    const load = this.loadingCtrl.create({ content: 'Loading...' });
    await load.present();

    this.tokenExp = await this.parseTokenExp();

    this.vehicleProvider.getVehicleByIdentifier('VU17UUT').subscribe(async (resp) => {
      if (resp) {
        this.response = resp;
      } else {
        this.response = null;
      }
      await load.dismiss();
    }, async (err) => {
      console.error(err);
      await load.dismiss()
    });
  }

  manualRefresh = async () => {
    await this.authProvider.manualRefresh();
  }

  parseTokenExp = async (): Promise<string> => {
    const exp = await this.authProvider.getTokenExpiry();
    const d = new Date(exp);
    return d.toLocaleString();
  }

}
