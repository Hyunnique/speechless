import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {InterviewQuestion} from "../types/Interview.ts";
import type {Statement} from "../types/Statement.ts";

interface InterviewSessionState {
	sessionId: string | null;
	connectionId: string | null;
	connectionString: string | null;
	title: string | null;
	questionsCount: number;
	statement: Statement | null;
	questions: InterviewQuestion[];
	questionCursor: number;

	setSessionId: (sessionId: string) => void;
	setConnection: (connectionId: string, connectionToken: string) => void;
	setTitle: (title: string) => void;
	setQuestionsCount: (questionsCount: number) => void;
	setStatement: (statement: Statement) => void;
	setQuestions: (questions: InterviewQuestion[]) => void;
	setQuestionCursor: (cursor: number) => void;
	clearSession: () => void;
}

interface SpeechSessionState {}

const useInterviewSessionStore = create<InterviewSessionState>()(
	persist(
		(set) => ({
			sessionId: null,
			connectionId: null,
			connectionString: null,
			title: null,
			questionsCount: 0,
			statement: null,
			questions: [],
			questionCursor: -1,

			setSessionId: (sessionId: string) => set({ sessionId }),
			setConnection: (connectionId: string, connectionString: string) => set({ connectionId, connectionString }),
			setTitle: (title: string) => set({ title }),
			setQuestionsCount: (questionsCount: number) => set({ questionsCount }),
			setStatement: (statement: Statement) => set({ statement }),
			setQuestions: (questions: InterviewQuestion[]) => set({ questions }),
			setQuestionCursor: (cursor: number) => set({ questionCursor: cursor }),

			clearSession: () => {
				set({ sessionId: null });
				set({ connectionId: null });
				set({ connectionString: null });
				set({ title: null });
				set({ questionsCount: 0 });
				set({ questionCursor: -1 });
				set({ statement: null });
				set({ questions: [] });
			},
		}),
		{
			name: 'interview-session',
		}
	)
);

const useSpeechSessionStore = create<SpeechSessionState>()((set) => ({}));

export { useInterviewSessionStore, useSpeechSessionStore };
