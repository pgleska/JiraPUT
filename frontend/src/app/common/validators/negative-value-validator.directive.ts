import {Directive, Input} from '@angular/core';
import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Position} from '../../position/position.model';

@Directive({
    selector: '[negativeValueValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NegativeValueValidatorDirective,
            multi: true
        }]
})
export class NegativeValueValidatorDirective implements Validator {
    @Input() position: Position;


    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (value && value < 0) {
            return {
                negative: true
            };
        }
    }
}
