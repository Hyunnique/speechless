import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InterviewSessionState {
	title: string;
}

interface SpeechSessionState {}

const useInterviewSessionStore = create<InterviewSessionState>()((set) => ({
	title: '',
}));

const useSpeechSessionStore = create<SpeechSessionState>()((set) => ({}));

export { useInterviewSessionStore, useSpeechSessionStore };
