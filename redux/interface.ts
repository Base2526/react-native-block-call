export interface CallLog {
    id: string;
    date: string; // Timestamp as string
    name: string;
    number: string;
    photoUri: string | null;
    type: string; // You might want to use an enum for types
    createdAt?: string; // New field
    updatedAt?: string; // New field
}