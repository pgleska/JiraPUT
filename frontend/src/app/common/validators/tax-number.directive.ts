import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';


@Directive({
    selector: '[taxNumberValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: TaxNumberDirective,
            multi: true
        }]
})
export class TaxNumberDirective implements Validator {

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value.toString();
        if (value.length !== 10) {
            return {
                taxNumberLength: true
            };
        }

        const weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        let sum = 0;
        const controlNumber = parseInt(value.substring(9, 10));
        const weightCount = weight.length;
        for (let i = 0; i < weightCount; i++) {
            sum += (parseInt(value.substr(i, 1)) * weight[i]);
        }

        if (sum % 11 === controlNumber) {
            return {
                taxNumberChecksum: true
            };
        }

    }
}
