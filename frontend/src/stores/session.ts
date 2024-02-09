import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {InterviewQuestion} from "../types/Interview.ts";
import type {Statement} from "../types/Statement.ts";

interface InterviewSessionState {
	sessionId: string | null;
	interviewId: string | null;
	recordingId: string | null;
	connectionId: string | null;
	connectionString: string | null;
	title: string | null;
	questionsCount: number;
	statement: Statement | null;
	questions: InterviewQuestion[];
	questionCursor: number;
	feedbackCursor: number;
	stage: string;

	setSessionId: (sessionId: string) => void;
	setInterviewId: (interviewId: string) => void;
	setRecordingId: (recordingId: string) => void;
	setConnection: (connectionId: string, connectionToken: string) => void;
	setTitle: (title: string) => void;
	setQuestionsCount: (questionsCount: number) => void;
	setStatement: (statement: Statement) => void;
	setQuestions: (questions: InterviewQuestion[]) => void;
	setQuestionCursor: (cursor: number) => void;
	setFeedBackCursor: (cursor: number) => void;
	setStage: (stage: string) => void;
	clearSession: () => void;
}

interface SpeechSessionState {}

const useInterviewSessionStore = create<InterviewSessionState>()(
	persist(
		(set) => ({
			sessionId: null,
			interviewId: null,
			recordingId: null,
			connectionId: null,
			connectionString: null,
			title: null,
			questionsCount: 0,
			statement: null,
			questions: [],
			questionCursor: 0,
			feedbackCursor: 0,
			stage: 'Start',

			setSessionId: (sessionId: string) => set({ sessionId }),
			setInterviewId: (interviewId: string) => set({ interviewId }),
			setRecordingId: (recordingId: string) => set({ recordingId }),
			setConnection: (connectionId: string, connectionString: string) => set({ connectionId, connectionString }),
			setTitle: (title: string) => set({ title }),
			setQuestionsCount: (questionsCount: number) => set({ questionsCount }),
			setStatement: (statement: Statement) => set({ statement }),
			setQuestions: (questions: InterviewQuestion[]) => set({ questions }),
			setQuestionCursor: (cursor: number) => set({ questionCursor: cursor }),
			setFeedBackCursor: (cursor: number) => set({ feedbackCursor: cursor }),
			setStage: (stage: string) => set({ stage }),

			clearSession: () => {
				set({ sessionId: null });
				set({ interviewId: null });
				set({ connectionId: null });
				set({ connectionString: null });
				set({ title: null });
				set({ questionsCount: 0 });
				set({ questionCursor: 0 });
				set({ feedbackCursor: 0 });
				set({ statement: null });
				set({ questions: [] });
				set({ stage: 'Start' });
			},
		}),
		{
			name: 'interview-session',
		}
	)
);

const useSpeechSessionStore = create<SpeechSessionState>()((set) => ({}));

export { useInterviewSessionStore, useSpeechSessionStore };
