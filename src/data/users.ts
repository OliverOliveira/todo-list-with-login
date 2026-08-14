// src/data/users.ts

export interface MockUser {
    id: string;
    name: string;
    email: string;
    password: string; // só existe aqui porque é simulação — nunca faria isso com dados reais
}

export const users: MockUser[] = [
    {
        id: "1",
        name: "João Silva",
        email: "joao@teste.com",
        password: "123456",
    },
    {
        id: "2",
        name: "Maria Souza",
        email: "maria@teste.com",
        password: "123456",
    },
    {
        id: "3",
        name: "Admin",
        email: "admin@teste.com",
        password: "admin123",
    },
];