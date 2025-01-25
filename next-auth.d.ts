import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      _id: string;
      username: string;
      password: string;
      markers: any[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }
}
