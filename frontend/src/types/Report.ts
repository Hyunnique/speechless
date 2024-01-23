export interface InterviewReport {
    id: number;
    userId: number;
    topic: string;
    pronunciationScore?: number;
    faceScore?: number;
    faceGraph?: string;
    startTime?: Date;
    endTime?: Date;
    report?: string;
    createdAt?: Date;
    updatedAt?: Date;
}