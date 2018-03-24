import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UtilProvider {

    constructor(public toastCtrl:  ToastController) {
    }

    copy(text){
        var temp = document.createElement('div');
        temp.appendChild(document.createElement('pre')).textContent = text;

        var s = temp.style;
        s.position = 'fixed';
        s.left = '-100%';

        document.body.appendChild(temp);
        document.getSelection().selectAllChildren(temp);

        var result = document.execCommand('copy');

        document.body.removeChild(temp);
        if(result){
            let toast = this.toastCtrl.create({
                message: 'コピーしました',
                duration: 300,
                position: 'top'
            });
            toast.present();
        }
        return result;
    }
    onToast(msg, dur:number = 300, pos:string = "top"){
        this.toastCtrl.create({
            message: msg,
            duration: dur,
            position: pos
        }).present()
    }

}
