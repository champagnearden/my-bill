import { APP_NAME } from '../../environments/environment'
import { UserModel } from './user.model';

export const SUBJECT = encodeURIComponent("Contact from "+APP_NAME);
export function generateBody(name: string, sender: UserModel): string {
    const senderName = `${sender.firstName} ${sender.middleName ? sender.middleName.charAt(0).toUpperCase()+'. ': ''}${sender.lastName}`;
    return encodeURI(`Hello ${name},

I need to inform you that...

Best regards,
${senderName}
${sender.phone}
${sender.email}
`);
}