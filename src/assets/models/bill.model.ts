export type BillDataModel = {
    clientName: string,
    clientEmail: string,
    clientAddress: string,
    webCreationType: string,
    numberOfPages: number,
    selectedOptions: boolean[],
    maintenancePlan: string,
    totalPrice: number,
    pricingData: any,
    invoiceNumber: string,
    creationDate: Date,
    dueDate: Date,
    
    monthlyPayment?: number,
};