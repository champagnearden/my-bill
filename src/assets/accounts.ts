import { UserModel } from "./models/user.model"

export const ADMIN = "ADMIN";
export const MODERATOR = "MODERATOR";
export const USER = "USER";

export const roles = [
    {
        name: ADMIN,
        y: 0
    },
    {
        name: USER,
        y:0
    },
    {
        name: MODERATOR,
        y:0
    }
];

export const accounts: UserModel[] = [
    {
        id: 1,
        gender: "Male",
        firstName: "Admin",
        middleName: "admin",
        lastName: "ADMIN",
        email: "admin@test.com",
        role: ADMIN,
        createdAt: 1734865756000,
        updatedAt: 1734865756000,
        username: "admin",
        billAddress: {
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        postAddress: {
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        phone: {
            fullNumber: "+330651310649",
            dialCode: "33",
            iso2: "fr"
        },
        hash: "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=",
        businessName: "The admin's business"
    },
    {
        id: 2,
        gender: "Female",
        firstName: "User",
        middleName: "user",
        lastName: "USER",
        email: "user@example.com",
        role: USER,
        createdAt: 1734865756000,
        updatedAt: 1734865756000,
        username: "user",
        billAddress: {
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        postAddress:{
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        phone: {
            fullNumber: "+440123456789",
            dialCode: "44",
            iso2: "gb"
        },
        hash: "BPiZbadjt6lpsQKO4wB1aerzpjVIbdqyEdUSyFud+Ps=",
        businessName: "The user's business"
    },
    {
        id: 3,
        gender: "Prefer not to say",
        firstName: "Marcel",
        middleName: "",
        lastName: "Smith",
        email: "marcel@yopmail.com",
        role: MODERATOR,
        createdAt: 1737827365000,
        updatedAt: 1738666126864,
        username: "marcel",
        billAddress: {
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        postAddress: {
            formatted_address: "7 Impasse de l'Hôtel Neuf, Irodouër, France",
            lat: 48.2424666,
            lng: -1.9499147
        },
        phone: {
            fullNumber: "+490299398616",
            dialCode: "49",
            iso2: "fr"
        },
        hash: "Y60fw7vEP+dbpf9wH05kA8HH36HlC38y5BfvS4KtHcQ=",
        businessName: "Orange Business SA"
    }
];

