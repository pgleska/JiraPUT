import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';


@Directive({
    selector: '[urlValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: UrlValidatorDirective,
            multi: true
        }]
})
export class UrlValidatorDirective implements Validator {

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (!/^[a-zA-Z0-9\-_]+$/.test(value)) {
            return {
                urlEncoding: true
            };
        }
    }
}
