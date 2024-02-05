import * as faceapi from 'face-api.js';

/*
- 정수로 점수 저장
- this.scores에 현재까지 저장된 점수 저장
- this.startTime과 this.endTime에 녹화 시작, 종료 시간 저장
- 외부에서 start(), stop() 함수로 조작
- video가 꺼져있으면 해당 시간엔 -1 저장
- 인식 되지 않을 경우엔 직전 값 사용
*/
export class FaceAnalyzer {
	private videoRef: React.RefObject<HTMLVideoElement>;
	private modelUrl: string = '/models';
	private intervalId: number | null = null;
	private lastKnownScore: number;
	public scores: number[] = [];
	public startTime: number | undefined;
	public endTime: number | undefined;

	constructor(videoRef: React.RefObject<HTMLVideoElement>) {
		this.videoRef = videoRef;
		this.lastKnownScore = -1;
		this.loadModels();
	}

	private async loadModels() {
		await faceapi.nets.tinyFaceDetector.loadFromUri(this.modelUrl);
		await faceapi.nets.faceLandmark68Net.loadFromUri(this.modelUrl);
		await faceapi.nets.faceRecognitionNet.loadFromUri(this.modelUrl);
		await faceapi.nets.faceExpressionNet.loadFromUri(this.modelUrl);
	}

	public start() {
		if (this.intervalId !== null) {
			return;
	}

	this.startTime = Date.now();

	this.lastKnownScore = -1;

	this.intervalId = window.setInterval(async () => {
		console.log(this.scores);

		if (!this.videoRef.current) {
		this.scores.push(-1);
		return;
		}

		const detections = await faceapi
		.detectAllFaces(this.videoRef.current, new faceapi.TinyFaceDetectorOptions())
		.withFaceLandmarks()
		.withFaceExpressions();

		if (detections.length >= 1) {
		const happyScore = detections[0].expressions.happy;
		const integerScore = Math.round(happyScore * 100);
		this.scores.push(integerScore);
		this.lastKnownScore = integerScore;
		} else {
		// No faces detected or more than one face detected, use the last known score
		this.scores.push(this.lastKnownScore);
		}

	}, 1000);
	}

	public stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.endTime = Date.now();
		}
	}
	
	public getScoreAtSection(sec: number): number {
		try{
			return this.scores[sec-1];
		}
		catch{
			return -1;
		}
	}
}