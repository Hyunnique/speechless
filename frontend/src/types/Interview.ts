interface InterviewQuestion {
    id?: number;
    interviewId?: number;
    question: string;
    answer: string;
    feedback: string;
    faceScore: number;
    faceScoreList: number[];
    speechScore: number;
}


export type { InterviewQuestion };