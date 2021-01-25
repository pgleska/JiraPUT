import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';


@Directive({
    selector: '[integerValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: IntegerValidatorDirective,
            multi: true
        }]
})
export class IntegerValidatorDirective implements Validator {

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;

        if (value !== Math.round(value) || isNaN(value))  {
            return {
                notInteger: true
            }
        }
    }
}
