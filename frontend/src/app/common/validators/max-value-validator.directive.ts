import {Directive, Input} from '@angular/core';
import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
    selector: '[maxValueValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: MaxValueValidatorDirective,
            multi: true
        }]
})
export class MaxValueValidatorDirective implements Validator {

    @Input() maxValue: number;

    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (value && value > this.maxValue) {
            return {
                maxValue: this.maxValue
            };
        }
    }
}
