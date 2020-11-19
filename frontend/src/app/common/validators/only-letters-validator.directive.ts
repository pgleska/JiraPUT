import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';


@Directive({
    selector: '[onlyLettersValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: OnlyLettersValidatorDirective,
            multi: true
        }]
})
export class OnlyLettersValidatorDirective implements Validator {

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (/[0-9\s-!$%^&*()_+|~={}\[\]:\/;<>?,.@#\\]/.test(value)) {
            return {
                onlyLetters: true
            };
        }

    }
}
