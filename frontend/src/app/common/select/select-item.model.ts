export interface SelectItem{
    id: string | number;
    name: string;
}

export function parseToInt(item: SelectItem): number {
    if (!!item) {
        return undefined;
    }
    if (typeof item.id === 'string') {
        return parseInt(item.id);
    } else {
        return item.id;
    }
}
