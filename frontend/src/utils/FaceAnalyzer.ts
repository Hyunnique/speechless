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
	public lastEmotion: { expression: string; probability: number } = { expression: '', probability: -1 };
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
			if (!this.videoRef.current) {
				return;
			}
			const detections = await faceapi
			.detectAllFaces(this.videoRef.current, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceExpressions();
	// 		if (detections.length >= 1) {
	// 			const happyScore = detections[0].expressions.happy;
	// 			secCumul.push(happyScore);
	// 		}
	// 		cnt += 1;
	// 		if(cnt >= 10){
	// 			if (secCumul.length==0) {
	// 				this.scores.push(-1);
	// 			}
	// 			else{
	// 				const meanScore = Math.floor(secCumul.reduce((a, b) => a + b, 0) / secCumul.length * 100);
	// 				this.scores.push(meanScore);
	// 			}

	// 			this.lastEmotion = detections[0].expressions.asSortedArray()[0];

	// 			secCumul = [];
	// 			cnt = 0;
	// 		}
	// 	}, 100);
	// }
			if (detections.length >= 1) {
				const happyScore = detections[0].expressions.happy;
				const intScore = Math.floor(happyScore*100);
				this.scores.push(intScore);
			}

			this.lastEmotion = detections[0].expressions.asSortedArray()[0];

			//secCumul = [];
			//cnt = 0;
	
		}, 1000);
	}
	public stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.endTime = Date.now();
		}
	}

	public clear(){
		this.stop();
		this.scores = [];
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