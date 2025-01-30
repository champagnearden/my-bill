import { AddressModel, DefaultAddress } from "./address.model"

export type UserModel = {
    id: number,
    gender: string
    firstName: string,
    middleName?: string,
    lastName: string,
    email: string,
    password?: string,
    role: string,
    createdAt: string,
    updatedAt: string,
    username: string,
    billAddress: AddressModel,
    postAddress: AddressModel,
    phone: string,
    hash: string,
    businessName: string
}

export const DefaultUser = {
    id: 0,
    gender: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    createdAt: '',
    updatedAt: '',
    username: '',
    billAddress: DefaultAddress,
    postAddress: DefaultAddress,
    phone: '',
    hash: '',
    businessName: ''

}