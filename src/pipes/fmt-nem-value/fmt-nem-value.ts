import { Pipe, PipeTransform } from '@angular/core';
import nem from "nem-sdk";

@Pipe({
    name: 'fmtNemValue',
})
export class FmtNemValuePipe implements PipeTransform {
    transform(value: number) {
        return nem.utils.format.nemValue(value);
    }
}
