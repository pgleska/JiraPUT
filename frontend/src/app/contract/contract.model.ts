export interface Contract {
    id?: number;
    contractNumber: string;
    companyName: string;
    companyTaxNumber: number;
    projectName: string;
    projectId: number;
    amount: number;
    conditions?: string;
}
