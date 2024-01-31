import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {InterviewQuestion} from "../types/Interview.ts";
import type {Statement} from "../types/Statement.ts";

interface InterviewSessionState {
	sessionId: string | null;
	title: string | null;
	statement: Statement | null;
	questions: InterviewQuestion[];
}

interface SpeechSessionState {}

const useInterviewSessionStore = create<InterviewSessionState>()(
	persist(
		(set) => ({
			sessionId: null,
			title: null,
			statement: null,
			questions: []
		}),
		{
			name: 'interview-session',
		}
	)
);

const useSpeechSessionStore = create<SpeechSessionState>()((set) => ({}));

export { useInterviewSessionStore, useSpeechSessionStore };
