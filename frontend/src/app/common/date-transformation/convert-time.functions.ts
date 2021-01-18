export function convertTimeToString(time: number) {
    console.log(time);
    if (time === 0) {
        return '0m';
    }
    let result = '';
    const days = Math.floor(time / 60 / 24);
    const hours = Math.floor((time - days * 60 * 24) / 60);
    const minutes = Math.floor(time % 60);
    if (days > 0) {
        result += `${days}d `;
    }
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0) {
        result += `${minutes}m`;
    }
    return result;
}

export function convertDurationToDate(time: number) {
    return new Date(time * 60000 - 3599000);
}
