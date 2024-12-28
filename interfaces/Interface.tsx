export interface TaskInterface {
	id: string;
	name: string;
	date: string;
	creator: string;
	members: string[] | null;
	deadline: string;
	status: string;
	position: number;
	project: string;
	send: boolean;
}

export interface UserInterface {
	id: string;
	email: string;
	username: string;
	avatar: string;
}

export interface SubtaskInterface {
	id: string;
	title: string;
	completed: boolean;
	task: string;
}
