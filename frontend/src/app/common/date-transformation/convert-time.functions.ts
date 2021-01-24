export function convertTimeToString(time: number) {
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

export function convertTimeDifferenceToString(time: number) {
    let result = '';
    if (time < 0) {
        result = 'Pozostało: ';
    } else {
        result = 'Przekroczono o: ';
    }
    time = Math.abs(time / 60);
    return result + convertTimeToString(time);
}

export function convertStringToTime(time: string): Date {
    if (!time) {
        return undefined;
    }

    let result = 0;
    if (time.includes('d')) {
        const splitTime = time.split('d');
        result += parseInt(splitTime[0]) * 24 * 60;
        time = splitTime[1];
    }

    if (time.includes('h')) {
        const splitTime = time.split('h');
        result += parseInt(splitTime[0]) * 60;
        time = splitTime[1];
    }

    if (time.includes('m')) {
        const splitTime = time.split('m');
        result += parseInt(splitTime[0]);
    }

    return new Date(result * 60000 + 1000);
}


