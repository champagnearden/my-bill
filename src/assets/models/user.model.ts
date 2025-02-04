import { AddressModel, DefaultAddress } from "./address.model"

export type UserModel = {
    businessName: string,
    billAddress: AddressModel,
    createdAt: number,
    email: string,
    firstName: string,
    gender: string
    hash: string,
    id: number,
    lastName: string,
    middleName: string,
    phone: PhoneModel,
    postAddress: AddressModel,
    role: string,
    updatedAt: number,
    username: string,
}

export type RoleModel = {
    name: string, // uppercased
    y: number
    prop?: number
}

export type MeDialogInject = {
    userInfo: UserModel,
    title: string,
    from: string
}

export type PhoneModel = {
    iso2: string,
    dialCode: string,
    fullNumber: string
}

export const DefaultPhone: PhoneModel = {
    iso2: 'fr',
    dialCode: '33',
    fullNumber: ''
}

export const DefaultUser: UserModel = {
    id: 0,
    gender: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: '',
    createdAt: 0,
    updatedAt: 0,
    username: '',
    billAddress: DefaultAddress,
    postAddress: DefaultAddress,
    phone: DefaultPhone,
    hash: '',
    businessName: '',
}

export const DefaultRole: RoleModel = {
    name: "",
    y: 0
}