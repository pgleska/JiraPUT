import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-technology-tag',
    template: `
        <div class="tag">{{name}}</div>
    `,
    styleUrls: ['./technology-tag.component.scss']
})
export class TechnologyTagComponent {
    @Input() name: string;
}
