export interface Contract {
    id?: number;
    contractNumber: string;
    companyName: string;
    taxNumber: number;
    projectName: string;
    projectId: number;
    amount: number;
    conditions?: string;
}
