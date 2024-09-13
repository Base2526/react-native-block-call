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
    address: string; // Phone number
    body: string;   // SMS body content
    date: string;   // Date of the SMS
    name: string;   // Contact name
    photoUri?: string; // Contact photo URI (optional)
    type: string;   // Message type (e.g., sent, received)
    read: number;   // Read status (1 for read, 0 for unread)
    status: string; // Delivery status of the message
    thread_id?: string; // SMS thread ID
}

export interface SmsLog {
    address: string;
    messages: ItemSms[]
    createdAt?: string; 
    updatedAt?: string; 
}

export enum BlockType {
    call = 0,
    sms = 1
}

export interface BlockLog {
    type: BlockType;
    name: string;
    address: string; // phone & address
    createdAt?: string; 
    updatedAt?: string; 
}