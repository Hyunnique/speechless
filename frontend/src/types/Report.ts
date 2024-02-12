import { InterviewQuestion } from "./Interview";


export interface InterviewReport {
    id: number,
    topic : string,
    pronunciationScore : number,
    pronunciationGraph : string,
    faceScore: number,
    faceGraph: string,
    questions: InterviewQuestion[]
}