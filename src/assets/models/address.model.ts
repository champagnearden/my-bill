export type AddressModel = {
    formatted_address: string,
    lat: number,
    lng: number
}

export const DefaultAddress: AddressModel = {
    formatted_address: 'ENSIBS',
    lat: 47.6449138,
    lng: -2.7490848
}