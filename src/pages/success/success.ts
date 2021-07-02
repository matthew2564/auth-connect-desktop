import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { VehicleProvider } from '../../providers/vehicle/vehicle.provider';

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {

  response = null;

  constructor(
    public vehicleProvider: VehicleProvider,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  getData = async () => {
    const load = this.loadingCtrl.create({ content: 'Loading...' });
    await load.present();

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

}
