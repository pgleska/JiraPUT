import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';


@Directive({
    selector: '[greaterThanValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: GreaterThanValidatorDirective,
            multi: true
        }]
})
export class GreaterThanValidatorDirective implements Validator {
    @Input() greaterThan: string;
    @Input() showErrorMessage: boolean = false;

    validate(c: FormControl): { [key: string]: any } {
        let v = c.value;
        let e = c.root.get(this.greaterThan);
        if (e && v < e.value && this.showErrorMessage) {
            return {
                salary: true
            };
        }
        if (e && v < e.value && !this.showErrorMessage) {
            delete e.errors['salary'];
            if (!Object.keys(e.errors).length) {
                e.setErrors(null);
            }
        }
        if (e && v > e.value && !this.showErrorMessage) {
            e.setErrors({salary: true});
        }

        return null;
    }
}
