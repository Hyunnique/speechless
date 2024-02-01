import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {InterviewQuestion} from "../types/Interview.ts";
import type {Statement} from "../types/Statement.ts";

interface InterviewSessionState {
	sessionId: string | null;
	connectionId: string | null;
	connectionString: string | null;
	title: string | null;
	statement: Statement | null;
	questions: InterviewQuestion[];
	setSessionId: (sessionId: string) => void;
	setConnection: (connectionId: string, connectionToken: string) => void;
	setTitle: (title: string) => void;
	setStatement: (statement: Statement) => void;
	setQuestions: (questions: InterviewQuestion[]) => void;
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
			statement: null,
			questions: [],

			setSessionId: (sessionId: string) => set({ sessionId }),
			setConnection: (connectionId: string, connectionString: string) => set({ connectionId, connectionString }),
			setTitle: (title: string) => set({ title }),
			setStatement: (statement: Statement) => set({ statement }),
			setQuestions: (questions: InterviewQuestion[]) => set({ questions }),

			clearSession: () => {
				set({ sessionId: null });
				set({ connectionId: null });
				set({ connectionString: null });
				set({ title: null });
				set({ statement: null });
				set({ questions: [] });
			}
		}),
		{
			name: 'interview-session',
		}
	)
);

const useSpeechSessionStore = create<SpeechSessionState>()((set) => ({}));

export { useInterviewSessionStore, useSpeechSessionStore };
