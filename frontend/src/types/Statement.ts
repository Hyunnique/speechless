export interface Statement {
	id: number;
	title: string;
	company: string;
	position?: string;
	career?: string;
	questions?: { question: string; answer: string }[];
	created_at?: Date;
	updated_at?: Date;
}
