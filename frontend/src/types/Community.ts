interface CommunityResponse {
	id: number;
	writer: string;
	category: string;
	title: string;
	content: string;
	sessionStart: string;
	deadline: string;
	createdAt: string;
	maxParticipants: number;
	hit: number;
	currentParticipants?: number;
}

interface CommunityView {
	id: number;
	writer: string;
	category: string;
	title: string;
	content: string;
	maxParticipants: number;
	deadline: Date;
	sessionStart: Date;
	createdAt: Date;
	hit : number;
	currentParticipants?: number;
}

export type { CommunityResponse, CommunityView };
