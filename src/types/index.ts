export interface Member {
    id?: string;
    firstName: string;
    lastName: string;
    facebookLink: string;
    role: 'Head' | 'Leader' | 'Support' | 'Member';
}

export interface Admin {
    id?: string;
    username: string;
    password?: string; // Optional because we don't return it to client
}
