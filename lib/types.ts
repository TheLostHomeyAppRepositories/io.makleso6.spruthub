type CharacteristicTypes = {
    id: string,
    shortId: string,
    type: string,
    name: string,
    format: string,
    read: boolean,
    write: boolean,
    events: boolean,
    hidden: boolean,
    min?: number,
    max?: number,
    step?: number,
    length?: number,
    unit?: string,
    validString?: string
};