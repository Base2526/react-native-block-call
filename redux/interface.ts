export interface ItemCall {
    id: string;
    date: string; 
    name: string;
    number: string;
    photoUri: string | null;
    type: string; 
    createdAt?: string; 
    updatedAt?: string; 
}

export interface CallLog {
    number: string;
    callLogs: ItemCall[];
    createdAt?: string; 
    updatedAt?: string; 
}

export interface ItemSms {
    id: string;
    number: string;
    body: string;
    date: string;
    name?: string; 
    photoUri?: string; 
    type: string;
    read: number;
    status: string;
    thread_id: string;
}

export interface SmsLog {
    address: string;
    messages: ItemSms[]
    createdAt?: string; 
    updatedAt?: string; 
}