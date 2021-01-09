import {FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import {Position} from '../../position/position.model';


@Directive({
    selector: '[salaryValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: SalaryRangeValidatorDirective,
            multi: true
        }]
})
export class SalaryRangeValidatorDirective implements Validator {
    @Input() position: Position;


    validate(formControl: FormControl): { [key: string]: any } {
        const value = formControl.value;
        if (value && !!this.position && value > this.position.maximumSalary) {
            return {
                maximumSalary: this.position.maximumSalary
            };
        }

        if (value && !!this.position && value < this.position.minimumSalary) {
            return {
                minimumSalary: this.position.minimumSalary
            };
        }
    }
}
