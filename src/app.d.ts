// See https://svelte.dev/docs/kit/types#app.d.ts

import type { TimeField } from "@internationalized/date";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type Todo = {
        id: number;
        title: string;
        description: string;
        due_date: string;
        completed: boolean;
        updated_at: string;
    };
	type LogEntry = {
		ID: number;
		IP: string;
		Email: string;
		Method: string;
		Path: string;
		Status: number;
		Message: string;
		Duration: string;
		Timestamp: TimeField; // atau Date jika di-convert
	};
	type User = {
		username: string;
		email: string;
		admin: boolean;
	};
	  
	  
	
}


export {};
