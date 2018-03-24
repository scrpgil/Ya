import { NgModule } from '@angular/core';
import { FmtNemValuePipe } from './fmt-nem-value/fmt-nem-value';
import { RemoveZeroPipe } from './remove-zero/remove-zero';
@NgModule({
	declarations: [FmtNemValuePipe,
    RemoveZeroPipe],
	imports: [],
	exports: [FmtNemValuePipe,
    RemoveZeroPipe]
})
export class PipesModule {}
