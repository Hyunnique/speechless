import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';
import { useLocalAxios } from '../../../utils/axios.ts';
import { useNavigate } from 'react-router-dom';
import { useInterviewSessionStore } from '../../../stores/session.ts';
import { Device, OpenVidu, Publisher, Session, StreamManager, Subscriber, SignalEvent } from 'openvidu-browser';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { InterviewQuestion } from '../../../types/Interview.ts';

type InterviewStage = 'Start' | 'Wait' | 'Question' | 'Answer' | 'End';
type EmotionExpression = 'happy' | 'neutral' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised';

interface EmotionData {
	expression: string;
	probability: number;
}

interface AnswerStopResponse {
	text: string;
	confidence: number;
}

interface SignalData {
	feedback?: string;
}

interface WorkerMessage {
	type: 'LOAD_MODELS' | 'ANALYZE_FACE';
	data?: {
		imageData: ImageData;
		modelUrl?: string;
	};
}

interface WorkerResponse {
	type: 'MODELS_LOADED' | 'ANALYSIS_RESULT' | 'ERROR';
	result?: {
		score: number | null;
		emotion: EmotionData | null;
	};
	error?: string;
}

const PRESET_QUESTIONS: string[] = [
	'1분 자기소개 해주세요.',
	'본인이 지원한 직무에 대해 설명해주세요.',
	'본인이 가장 잘한 프로젝트에 대해 설명해주세요.',
	'본인이 가장 어려웠던 프로젝트에 대해 설명해주세요.',
	'본인이 가장 자신있는 기술에 대해 설명해주세요.',
	'본인이 가장 부족하다고 생각하는 기술에 대해 설명해주세요.',
	'본인이 가장 중요하다고 생각하는 가치에 대해 설명해주세요.',
	'인생에서 가장 힘들었던 경험이 무엇인가요?',
	'왜 이 직무를 선택했나요?',
	'동료, 친구들이 나를 어떤 사람으로 생각할까요?',
	'본인의 장단점에 대해 설명해주세요.',
	'평소에 스트레스를 해소하는 방법은 무엇인가요?',
	'본인이 가장 좋아하는 책은 무엇인가요?',
	'본인의 취미는 무엇인가요?',
	'왜 굳이 우리 회사에 지원하려고 하나요?',
	'동료가 잘못을 했을 때 어떻게 조치할 것인가요?',
];

const MOCK_ANSWER: string = `
저는 프론트엔드 개발자로 지원하게 된 이유는 제 관심과 열정이 웹 개발 분야에 깊게 뿌리를 두고 있기 때문입니다. 여러 가지 이유로 프론트엔드 개발에 대한 열정을 키워왔습니다.
우선적으로, 저는 사용자 경험을 개선하고 사용자들에게 가치를 제공하는 기술을 만들기에 흥미를 느낍니다. 프론트엔드 개발은 이를 달성하는 데 중요한 역할을 합니다. 웹 사이트나 애플리케이션의 디자인과 사용자 인터페이스를 개선함으로써 사용자들이 보다 쉽고 효과적으로 목적을 달성할 수 있도록 돕는 것이 목표입니다.
또한, 프론트엔드 개발은 창의성과 문제 해결 능력을 요구하는 분야입니다. 디자인과 기술적인 요소를 결합하여 사용자들에게 매력적인 경험을 제공하기 위해 새로운 아이디어를 고안하고 구현하는 과정에서 큰 만족감을 느낍니다. 또한, 프론트엔드 개발에서 발생하는 다양한 문제들을 해결하는 과정에서 끊임없는 학습과 성장이 가능하다고 생각합니다.
또한, 현재의 프론트엔드 기술은 계속해서 발전하고 있습니다. 새로운 프레임워크, 라이브러리, 도구들이 등장함에 따라 개발자로서 항상 새로운 것을 배우고 적용하는 것이 필요합니다. 이러한 도전과 성장의 기회를 통해 더 나은 개발자로 성장할 수 있다고 믿습니다.
마지막으로, 프론트엔드 개발은 협업과 소통이 중요한 분야입니다. 디자이너, 백엔드 개발자, 프로젝트 매니저 등과의 원활한 커뮤니케이션을 통해 팀으로서의 목표를 달성하는 과정에서 제 역량을 발휘하고 싶습니다.
이러한 이유들로 인해 저는 프론트엔드 개발자로 지원하게 되었으며, 이 직무에서 제 역량을 발휘하여 회사의 성공에 기여하고 싶습니다.
`;

const MOCK_FEEDBACK: string = `
이 답변은 프론트엔드 개발자로의 지원 동기를 명확하게 전달하고 있습니다. 지원자는 자신의 관심과 열정이 웹 개발 분야에 깊게 뿌리를 두고 있다고 설명하며, 프론트엔드 개발이 사용자 경험을 개선하고 가치를 제공하는 기술을 만드는 과정에 흥미를 느끼고 있다고 강조하고 있습니다.
특히, 사용자 중심의 접근 방식과 창의성, 문제 해결 능력이 프론트엔드 개발에서 요구되는 요소라고 잘 제시하였습니다. 또한, 기술의 지속적인 발전과 이에 대한 학습에 대한 의지와 협업과 소통이 중요하다는 것을 강조하여 자신의 성장과 회사의 성공에 기여하고자 하는 의지를 잘 드러내었습니다.
답변은 구체적이고 직접적으로 이유를 제시하여 설득력을 높이고 있으며, 프론트엔드 개발자로의 역량과 기여에 대한 자신감을 잘 전달하고 있습니다. 전반적으로 훌륭한 지원 동기를 나타내는 답변입니다.
이 답변을 더욱 강화하고 개선하기 위해 몇 가지 아이디어가 있습니다.
구체적인 예시 추가: 프론트엔드 개발에 흥미를 갖게 된 구체적인 경험 또는 프로젝트에 대한 언급을 추가하여, 지원자가 어떻게 이러한 열정을 발전시켰는지를 더 잘 보여줄 수 있습니다.
회사와의 연결: 회사의 제품 또는 서비스와 관련하여 언급하면 더 맞춤화된 지원 동기를 제시할 수 있습니다.
간결함과 명확함: 답변을 더 간결하고 명확하게 만들어 지원 동기를 더 직관적으로 전달할 수 있습니다. 불필요한 구절이나 중복된 내용을 줄이고, 핵심 아이디어를 강조합니다.
자기개발에 대한 계획: 프론트엔드 개발 분야에서의 자기개발 계획이나 관련 교육, 자격증 취득 등에 대한 계획을 언급하여, 지원자가 지속적인 성장에 대한 의지를 강조할 수 있습니다.
`;

const EMOTION_ICONS: Record<EmotionExpression, string> = {
	happy: 'sentiment_very_satisfied',
	neutral: 'sentiment_neutral',
	sad: 'sentiment_sad',
	angry: 'sentiment_extremely_dissatisfied',
	fearful: 'sentiment_stressed',
	disgusted: 'sentiment_dissatisfied',
	surprised: 'sentiment_frustrated',
} as const;

const MODEL_URL: string = '/models';

export const InterviewPage = () => {
	const localAxios = useLocalAxios();
	const navigate = useNavigate();
	const interviewSessionStore = useInterviewSessionStore();

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const faceWorkerRef = useRef<Worker | null>(null);
	const questionsRef = useRef<InterviewQuestion[]>([]);
	const questionCursor = useRef<number>(0);
	const feedbackCursor = useRef<number>(0);
	const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
	const scoresRef = useRef<number[]>([]);
	const intervalId = useRef<number | null>(null);

	const [OV, setOV] = useState<OpenVidu | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [mainStreamManager, setMainStreamManager] = useState<StreamManager | null>(null);
	const [publisher, setPublisher] = useState<Publisher | null>(null);
	const [subscribers, setSubscribers] = useState<(Publisher | Subscriber | StreamManager)[]>([]);
	const [currentVideoDevice, setCurrentVideoDevice] = useState<Device | undefined>(undefined);
	const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
	const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
	const [currentQuestion, setCurrentQuestion] = useState<string>('');
	const [lastEmotion, setLastEmotion] = useState<EmotionData>({ expression: '', probability: -1 });
	const [lastScore, setLastScore] = useState<number>(0);
	const [uniqueKey, setUniqueKey] = useState<number>(-1);
	const [duration, setDuration] = useState<number | undefined>();
	const [remainingTime, setRemainingTime] = useState<number | undefined>();
	const [timerOn, setTimerOn] = useState<boolean>(false);

	useEffect(() => {
		initializeComponent();
		return cleanup;
	}, []);

	useEffect(() => {
		if (mainStreamManager && videoRef.current) {
			mainStreamManager.addVideoElement(videoRef.current);
		}
	}, [mainStreamManager]);

	useEffect(() => {
		if (remainingTime === 0) {
			moveToNextState();
		}
	}, [remainingTime]);

	const initializeComponent = async (): Promise<void> => {
		try {
			await setPresetQuestions();
			await initSession();
			initializeFaceWorker();
			initializeTTS();
			stopTimer();
		} catch (error) {
			console.error(error);
			handleSessionError();
		}
	};

	const cleanup = (): void => {
		window.speechSynthesis.onvoiceschanged = null;
		if (faceWorkerRef.current) {
			faceWorkerRef.current.terminate();
			faceWorkerRef.current = null;
		}
	};

	const handleSessionError = (): void => {
		interviewSessionStore.clearSession();
		navigate('/error', {
			replace: true,
			state: {
				code: 404,
				message: '세션을 찾지 못했습니다. 이미 종료된 세션일 가능성이 높습니다.',
			},
		});
	};

	const initializeFaceWorker = (): void => {
		if (faceWorkerRef.current) {
			faceWorkerRef.current.terminate();
		}

		faceWorkerRef.current = new Worker('/face-worker.js');
		
		faceWorkerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
			const { type, result, error } = event.data;
			
			switch (type) {
				case 'MODELS_LOADED':
					console.log('Face models loaded in worker');
					break;
				case 'ANALYSIS_RESULT':
					handleFaceAnalysisResult(result);
					break;
				case 'ERROR':
					console.error('Face worker error:', error);
					handleFaceAnalysisError();
					break;
			}
		};

		faceWorkerRef.current.onerror = (error) => {
			console.error('Face worker error:', error);
			handleFaceAnalysisError();
		};

		const loadMessage: WorkerMessage = { 
			type: 'LOAD_MODELS', 
			data: { modelUrl: MODEL_URL } 
		};
		faceWorkerRef.current.postMessage(loadMessage);

		if (!canvasRef.current) {
			canvasRef.current = document.createElement('canvas');
		}
	};

	const handleFaceAnalysisResult = (result?: { score: number | null; emotion: EmotionData | null }): void => {
		if (!result) {
			handleFaceAnalysisError();
			return;
		}

		if (result.score !== null && result.emotion) {
			scoresRef.current.push(result.score);
			setLastEmotion(result.emotion);
			setLastScore(result.score);
		} else {
			const lastScore = scoresRef.current.length === 0 ? 0 : scoresRef.current[scoresRef.current.length - 1];
			scoresRef.current.push(lastScore);
		}
	};

	const handleFaceAnalysisError = (): void => {
		const lastScore = scoresRef.current.length === 0 ? 0 : scoresRef.current[scoresRef.current.length - 1];
		scoresRef.current.push(lastScore);
	};

	const setPresetQuestions = async (): Promise<void> => {
		if (interviewSessionStore.questions.length === 0) {
			const questionsCount = interviewSessionStore.questionsCount;
			const randomQuestions = PRESET_QUESTIONS
				.sort(() => Math.random() - Math.random())
				.slice(0, questionsCount);
			
			setCurrentQuestion(randomQuestions[0] || '');
			questionsRef.current = randomQuestions.map((question) => ({
				question,
				answer: '',
				feedback: '',
				faceScoreList: [],
				faceScore: 0,
				speechScore: 0,
			}));
			interviewSessionStore.setQuestions(questionsRef.current);
		} else {
			questionsRef.current = interviewSessionStore.questions;
			questionCursor.current = interviewSessionStore.questionCursor;
			feedbackCursor.current = interviewSessionStore.feedbackCursor;
		}
	};

	const initSession = useCallback(async (): Promise<void> => {
		const ov = new OpenVidu();
		if (session !== null || !ov) return;

		const mySession = ov.initSession();
		setupSessionEventHandlers(mySession);
		setSession(mySession);

		if (!interviewSessionStore.sessionId) {
			navigate('/error/404');
			return;
		}

		const sessionId = interviewSessionStore.sessionId;
		const connectionData = await createConnection(sessionId);
		interviewSessionStore.setConnection(connectionData.connectionId, connectionData.token);

		await mySession.connect(connectionData.token);
		await setupPublisher(ov, mySession);
		setOV(ov);

		if (import.meta.env.VITE_USE_AI_API === 'true') {
			await requestAIQuestions(sessionId);
		}
	}, [interviewSessionStore, navigate]);

	const setupSessionEventHandlers = (mySession: Session): void => {
		mySession.on('streamCreated', (event) => {
			const subscriber = mySession.subscribe(event.stream, undefined);
			setSubscribers((prev) => [...prev, subscriber]);
		});

		mySession.on('streamDestroyed', (event) => {
			deleteSubscriber(event.stream.streamManager);
		});

		mySession.on('exception', (exception) => {
			console.warn(exception);
		});

		mySession.on('signal', handleSignalEvents);
	};

	const handleSignalEvents = (e: SignalEvent): void => {
		if (!e.data) return;

		if (e.type === 'signal:question') {
			const list: string[] = JSON.parse(e.data);
			const cleanedList = list.map((item: string) => 
				item.replace(/^\d+\.\s+/, '').replace(/\\n$/, '')
			);
			updateQuestionsFromSignal(cleanedList);
		}

		if (e.type === 'signal:feedback') {
			const data: SignalData = JSON.parse(e.data);
			if (data.feedback) {
				questionsRef.current[feedbackCursor.current].feedback = data.feedback;
				interviewSessionStore.setQuestions(questionsRef.current);
				feedbackCursor.current += 1;
				interviewSessionStore.setFeedBackCursor(feedbackCursor.current);
			}
		}
	};

	const updateQuestionsFromSignal = (cleanedList: string[]): void => {
		const questions: InterviewQuestion[] = [];
		for (let index = 0; index < questionCursor.current + 1; index++) {
			questions.push(questionsRef.current[index]);
		}
		for (let index = questionCursor.current + 1; index < cleanedList.length; index++) {
			questions.push({
				question: cleanedList[index],
				answer: '',
				feedback: '',
				faceScoreList: [],
				faceScore: 0,
				speechScore: 0,
			});
		}
		questionsRef.current = questions;
		interviewSessionStore.setQuestions(questionsRef.current);
		setCurrentQuestion(questionsRef.current[questionCursor.current]?.question || '');
	};

	const setupPublisher = async (ov: OpenVidu, mySession: Session): Promise<void> => {
		const _publisher = await ov.initPublisherAsync(undefined, {
			audioSource: undefined,
			videoSource: undefined,
			publishAudio: audioEnabled,
			publishVideo: videoEnabled,
			resolution: '640x480',
			frameRate: 30,
			insertMode: 'APPEND',
			mirror: true,
		});

		await mySession.publish(_publisher);

		const devices = await ov.getDevices();
		const videoDevices = devices.filter((device) => device.kind === 'videoinput');
		const currentVideoDeviceId = _publisher.stream.getMediaStream().getVideoTracks()[0]?.getSettings().deviceId;
		const _currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

		setMainStreamManager(_publisher);
		setPublisher(_publisher);
		setCurrentVideoDevice(_currentVideoDevice);
	};

	const requestAIQuestions = async (sessionId: string): Promise<void> => {
		if (!interviewSessionStore.statement?.id) return;
		
		await localAxios.post('interview/question', {
			interviewId: interviewSessionStore.interviewId,
			sessionId: sessionId,
			statementId: interviewSessionStore.statement.id,
			questionCnt: interviewSessionStore.questionsCount,
		});
	};

	const createConnection = async (sessionId: string): Promise<any> => {
		const response = await localAxios.post(
			`openvidu/sessions/${sessionId}/connections`,
			{},
			{ headers: { 'Content-Type': 'application/json' } }
		);
		return response.data;
	};

	const deleteSubscriber = useCallback(
		(streamManager: StreamManager): void => {
			setSubscribers((prevSubscribers) => {
				const index = prevSubscribers.indexOf(streamManager);
				if (index > -1) {
					const newSubscribers = [...prevSubscribers];
					newSubscribers.splice(index, 1);
					return newSubscribers;
				}
				return prevSubscribers;
			});
		},
		[subscribers]
	);

	const toggleVideo = (): void => {
		if (publisher) {
			publisher.publishVideo(!videoEnabled);
			setVideoEnabled(!videoEnabled);
		}
	};

	const toggleAudio = (): void => {
		if (publisher) {
			publisher.publishAudio(!audioEnabled);
			setAudioEnabled(!audioEnabled);
		}
	};

	const disconnectAndQuit = (): void => {
		session?.disconnect();
		setSession(null);
		setMainStreamManager(null);
		setPublisher(null);
		setSubscribers([]);
		interviewSessionStore.clearSession();
		navigate('/interview');
	};

	const captureVideoFrame = (): ImageData | null => {
		if (!videoRef.current || !canvasRef.current) return null;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		
		if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0);

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	};

	const analyzeFaceWithWorker = (): void => {
		if (!faceWorkerRef.current) return;

		const imageData = captureVideoFrame();
		if (!imageData) return;

		const message: WorkerMessage = {
			type: 'ANALYZE_FACE',
			data: { imageData }
		};

		faceWorkerRef.current.postMessage(message);
	};

	const startFaceAnalyze = (): void => {
		if (intervalId.current !== null) return;
		intervalId.current = window.setInterval(analyzeFaceWithWorker, 1000);
	};

	const stopFaceAnalyze = (): void => {
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	};

	const clearFaceAnalyze = (): void => {
		stopFaceAnalyze();
		scoresRef.current = [];
	};

	const initializeTTS = (): void => {
		const setVoices = (): void => {
			voicesRef.current = window.speechSynthesis.getVoices();
		};
		setVoices();
		window.speechSynthesis.onvoiceschanged = setVoices;
	};

	const speech = (text: string): void => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'ko-KR';

		if (!voicesRef.current?.length) {
			voicesRef.current = window.speechSynthesis.getVoices();
		}

		const koreanVoice = voicesRef.current?.find(
			(voice) => voice.lang === 'ko-KR' || voice.lang === 'ko_KR'
		);

		if (koreanVoice) {
			utterance.voice = koreanVoice;
			window.speechSynthesis.speak(utterance);
		} else {
			console.log('한국어 목소리를 찾을 수 없습니다.');
		}
	};

	const stopTimer = (): void => {
		setTimerOn(false);
		setDuration(999);
	};

	const restartTimer = (newDuration: number): void => {
		setDuration(newDuration);
		setTimerOn(true);
		setUniqueKey((prev) => prev + 1);
	};

	const timerOnUpdate = (remainingTime: number): void => {
		setRemainingTime(remainingTime);
	};

	const startQuestion = (): void => {
		const currentQuestionText = questionsRef.current[questionCursor.current]?.question;
		if (currentQuestionText) {
			speech(currentQuestionText);
		}
		interviewSessionStore.setStage('Question');
		stopTimer();
	};

	const startAnswer = async (): Promise<void> => {
		if (import.meta.env.VITE_USE_AI_API === 'true') {
			const response = await localAxios.post(`openvidu/recording/start/${interviewSessionStore.sessionId}`);
			interviewSessionStore.setRecordingId(response.data);
		}
		
		interviewSessionStore.setStage('Answer');
		restartTimer(60);
		startFaceAnalyze();
	};

	const stopAnswer = async (): Promise<void> => {
		stopFaceAnalyze();
		
		if (import.meta.env.VITE_USE_AI_API === 'true') {
			await handleRealAnswerStop();
		} else {
			handleMockAnswerStop();
		}

		clearFaceAnalyze();
		questionCursor.current += 1;
		interviewSessionStore.setQuestionCursor(questionCursor.current);

		if (questionCursor.current >= questionsRef.current.length) {
			interviewSessionStore.setStage('End');
		} else {
			setCurrentQuestion(questionsRef.current[questionCursor.current]?.question || '');
			stopTimer();
			interviewSessionStore.setStage('Wait');
		}
	};

	const handleRealAnswerStop = async (): Promise<void> => {
		const response = await localAxios.post(`openvidu/recording/stop/${interviewSessionStore.recordingId}`, {
			interviewId: interviewSessionStore.interviewId,
			question: questionsRef.current[questionCursor.current]?.question,
		});

		const data: AnswerStopResponse = response.data;
		updateQuestionData(data.text, Math.floor(data.confidence * 100));
	};

	const handleMockAnswerStop = (): void => {
		questionsRef.current[feedbackCursor.current].feedback = MOCK_FEEDBACK;
		feedbackCursor.current += 1;
		updateQuestionData(MOCK_ANSWER, 50);
	};

	const updateQuestionData = (answer: string, speechScore: number): void => {
		const currentQuestionIndex = questionCursor.current;
		const question = questionsRef.current[currentQuestionIndex];
		if (!question) return;

		question.answer = answer;
		question.faceScoreList = [...scoresRef.current];
		question.faceScore = scoresRef.current.length > 0 
			? Math.floor(scoresRef.current.reduce((a, b) => a + b, 0) / scoresRef.current.length)
			: 0;
		question.speechScore = speechScore;
		interviewSessionStore.setQuestions(questionsRef.current);
	};

	const endInterview = (): void => {
		const questionCount = questionsRef.current.length;
		const interviewResult = {
			interviewId: interviewSessionStore.interviewId,
			pronunciationScore: calculateAverageScore('speechScore', questionCount),
			faceScore: calculateAverageScore('faceScore', questionCount),
			faceGraph: JSON.stringify(questionsRef.current.slice(0, questionCount).map(q => q.faceScoreList)),
			pronunciationGraph: JSON.stringify(questionsRef.current.slice(0, questionCount).map(q => q.speechScore)),
		};

		localAxios
			.delete(`/openvidu/sessions/${interviewSessionStore.sessionId}`, { data: interviewResult })
			.then(() => disconnectAndQuit())
			.catch(console.error);
	};

	const calculateAverageScore = (scoreType: 'speechScore' | 'faceScore', questionCount: number): number => {
		return questionsRef.current
			.slice(0, questionCount)
			.reduce((acc, question) => acc + question[scoreType], 0) / questionCount;
	};

	const moveToNextState = (): void => {
		const stageActions: Record<InterviewStage, () => void | Promise<void>> = {
			Start: startQuestion,
			Wait: startQuestion,
			Question: startAnswer,
			Answer: stopAnswer,
			End: endInterview,
		};

		const currentStage = interviewSessionStore.stage as InterviewStage;
		const action = stageActions[currentStage];
		if (action) {
			action();
		}
	};

	const getEmotionIcon = (expression: string): string => {
		return EMOTION_ICONS[expression as EmotionExpression] || 'sentiment_neutral';
	};

	const renderEmotionIndicator = (): JSX.Element => {
		if (interviewSessionStore.stage !== 'Answer') {
			return (
				<div className='session-indicator-expression flex gap-2 items-center'>
					<span className='text-3xl invisible'>0</span>
				</div>
			);
		}

		return (
			<div className='session-indicator-expression flex gap-2 items-center'>
				<span className='text-2xl font-semibold'>표정</span>
				<span className='material-symbols-outlined text-yellow-400 text-5xl'>
					{getEmotionIcon(lastEmotion.expression)}
				</span>
				<span className='text-xl font-semibold'>{lastScore}</span>
			</div>
		);
	};

	const renderMainContent = (): JSX.Element | null => {
		if (interviewSessionStore.stage === 'Wait' || interviewSessionStore.stage === 'End') {
			return <>{renderQuestionsList()}</>;
		}
		
		if (interviewSessionStore.stage === 'Answer') {
			return renderTimer();
		}
		
		if (interviewSessionStore.stage === 'Question') {
			return (
				<div className='flex justify-center items-center h-full'>
					<span className='text-2xl'>질문에 대한 답이 준비되면 다음을 클릭해 주세요.</span>
				</div>
			);
		}

		return null;
	};

	const renderQuestionsList = (): JSX.Element[] => {
		return interviewSessionStore.questions
			.slice(0, questionCursor.current)
			.map((question, index) => (
				<Card key={index} className='mx-3 mb-5'>
					<div className='w-full border-b-2 border-gray-400 flex justify-between pb-1'>
						<div className='flex items-center gap-2'>
							<span className='text-2xl font-semibold'>Q.</span>
							<span className='text-xl'>{question.question}</span>
						</div>
						<div className='flex items-center gap-3'>
							<div className='flex items-center gap-1'>
								<span className='material-symbols-outlined'>face</span>
								<span>{question.faceScore}</span>
							</div>
							<div className='flex items-center gap-0.5'>
								<span className='material-symbols-outlined'>mic</span>
								<span>{question.speechScore}</span>
							</div>
						</div>
					</div>
					<div className='w-full border-b-2 border-gray-400 flex gap-2 pb-1'>
						<span className='text-2xl font-semibold'>A.</span>
						<span className='text-md text-gray-700'>{question.answer}</span>
					</div>
					<div className='w-full'>
						<div className='text-xl font-semibold mb-2'>[피드백]</div>
						<div className='ml-3 text-teal-600'>{question.feedback}</div>
					</div>
				</Card>
			));
	};

	const renderTimer = (): JSX.Element => {
		return (
			<div className='flex justify-center items-center h-full'>
				<CountdownCircleTimer
					key={uniqueKey}
					isPlaying={timerOn}
					duration={duration || 999}
					colors={['#004777', '#F7B801', '#A30000', '#A30000']}
					colorsTime={[60, 45, 20, 0]}
					onUpdate={timerOnUpdate}
					strokeWidth={20}
					size={400}
				>
					{({ remainingTime }) => <div className='text-5xl font-bold'>{remainingTime}</div>}
				</CountdownCircleTimer>
			</div>
		);
	};

	const getStageTitle = (): string => {
		const stageTitles: Record<InterviewStage, string> = {
			Start: '시작 버튼을 눌러주세요.',
			Wait: '준비되셨으면 다음을 눌러주세요.',
			Question: currentQuestion,
			Answer: currentQuestion,
			End: '완료 버튼을 눌러주세요.',
		};
		return stageTitles[interviewSessionStore.stage as InterviewStage] || '에러 발생';
	};

	const getButtonText = (): string => {
		const buttonTexts: Record<InterviewStage, string> = {
			Start: '시작',
			Wait: '다음',
			Question: '답변 시작',
			Answer: '답변 종료',
			End: '완료',
		};
		return buttonTexts[interviewSessionStore.stage as InterviewStage] || '에러 발생';
	};

	return (
		<div className='w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col items-center'>
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			<div className='p-10 w-[90vw] h-[80vh]'>
				<div className='session-header flex justify-end'>
					<CustomButton onClick={disconnectAndQuit} size='lg' color='negative' className='mr-12'>
						면접 종료
					</CustomButton>
				</div>
				
				<div className='session-title flex justify-center text-3xl mt-5'>
					{getStageTitle()}
				</div>
				
				<div className='session-body flex-1 mt-7'>
					<div className='session-content grid grid-cols-2 flex-1'>
						<div className='session-screen flex flex-col items-center justify-center'>
							<div className='session-screen-container flex flex-col'>
								<div className='session-screen-header flex justify-end py-3 gap-4'>
									{renderEmotionIndicator()}
								</div>
								
								<video className='border-2 border-black' autoPlay={true} ref={videoRef} />
								
								<div className='flex flex-row justify-center m-10 gap-16'>
									<Button
										className={`rounded-full aspect-square border-2 border-black ${
											audioEnabled ? 'bg-white' : 'bg-negative-500'
										}`}
										onClick={toggleAudio}
									>
										<span className={`material-symbols-outlined text-3xl ${
											audioEnabled ? 'text-black' : 'text-white'
										}`}>
											{audioEnabled ? 'mic' : 'mic_off'}
										</span>
									</Button>
									
									<Button
										className={`rounded-full aspect-square border-2 border-black ${
											videoEnabled ? 'bg-white' : 'bg-negative-500'
										}`}
										onClick={toggleVideo}
									>
										<span className={`material-symbols-outlined text-3xl ${
											videoEnabled ? 'text-black' : 'text-white'
										}`}>
											{videoEnabled ? 'screen_share' : 'stop_screen_share'}
										</span>
									</Button>
								</div>
							</div>
						</div>
						
						<div className='session-ui flex flex-col'>
							<div className='h-[65vh] mr-12 mt-10 gird grid-cols-1 items-center overflow-auto'>
								{renderMainContent()}
							</div>
							
							<div className='basis-1/6 mt-5'>
								<div className='flex justify-end'>
									<CustomButton size='lg' color='blue' onClick={moveToNextState} className='mr-12'>
										{getButtonText()}
									</CustomButton>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};