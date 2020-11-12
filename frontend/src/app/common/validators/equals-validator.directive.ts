import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';


@Directive({
    selector: '[equalsValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: EqualsValidatorDirective,
            multi: true
        }]
})
export class EqualsValidatorDirective implements Validator {
    @Input() validateEqualsTo: string;
    @Input() showErrorMessage: boolean = false;


    validate(c: FormControl): { [key: string]: any } {
        let v = c.value;
        let e = c.root.get(this.validateEqualsTo);
        if (e && v !== e.value && this.showErrorMessage) {
            return {
                password: true
            };
        }
        if (e && v === e.value && !this.showErrorMessage) {
            delete e.errors['password'];
            if (!Object.keys(e.errors).length) {
                e.setErrors(null);
            }
        }
        if (e && v !== e.value && !this.showErrorMessage) {
            e.setErrors({password: true});
        }
        return null;
    }
}
