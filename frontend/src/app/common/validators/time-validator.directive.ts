import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';


@Directive({
    selector: '[timeValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: TimeValidatorDirective,
            multi: true
        }]
})
export class TimeValidatorDirective implements Validator {

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (!!value && !/^([0-9]+d)?\s*([0-9]+h)?\s*([0-9]+m)?\s*$/.test(value)) {
            return {
                timeInput: true
            };
        }
    }
}
