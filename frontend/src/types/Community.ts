interface CommunityView {
	id: number;
	writer: string;
	category: string;
	title: string;
	content: string;
	currentParticipants: number;
	maxParticipants: number;
	deadline: Date;
	sessionStart: Date;
	invisible: boolean;
	private: boolean;
	createdAt: Date;
}

export type { CommunityView };
