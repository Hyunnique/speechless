/* eslint-disable jsx-a11y/media-has-caption */

import {useCallback, useEffect, useRef, useState} from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

import { useLocalAxios } from '../../../utils/axios.ts';
import { useNavigate } from "react-router-dom";

import { useInterviewSessionStore } from "../../../stores/session.ts";
import {Device, OpenVidu, Publisher, Session, StreamManager, Subscriber} from "openvidu-browser";
import {OpenViduVideo} from "../../../components/OpenViduVideo.tsx";

//import { FaceAnalyzer } from '../../../utils/FaceAnalyzer.ts';
import * as faceapi from 'face-api.js';

export const InterviewPage = () => {

	const localAxios = useLocalAxios();
	const navigate = useNavigate();

	const interviewSessionStore = useInterviewSessionStore();

	const videoRef = useRef<HTMLVideoElement>(null);

	const [ OV, setOV ] = useState<OpenVidu | null>(null);
	const [ session, setSession ] = useState<Session | null>(null);
	const [ mainStreamManager, setMainStreamManager ] = useState<StreamManager | null>(null);
	const [ publisher, setPublisher ] = useState<Publisher | null>(null);
	const [ subscribers, setSubscribers ] = useState<(Publisher | Subscriber | StreamManager)[]>([]);
	const [ currentVideoDevice, setCurrentVideoDevice ] = useState<Device | undefined>(undefined);

	const [ videoEnabled, setVideoEnabled ] = useState(true);
	const [ audioEnabled, setAudioEnabled ] = useState(true);

	const [ currentQuestion, setCurrentQuestion ] = useState('');

	const [ stage, setStage ] = useState('Start');
	const questionCursor = useRef(0);

	//const faceAnalyzer = useRef<FaceAnalyzer>(new FaceAnalyzer(videoRef))
	const [lastEmotion, setLastEmotion] = useState({expression: '', probability: -1}); 
	const [scores, setScores] = useState([] as number[]);
	const intervalId = useRef<number | null>(null);
	const modelUrl = '/models';

	// 페이지 진입시 서비스 플로우 시작
	useEffect(() => {
		initSession()
			.then(() => {
				setPresetQuestions();
			})
			.catch((e) => {
				console.error(e);
				// 에러가 발생해서 session을 초기화하지 못했으므로 에러 페이지로 이동
				interviewSessionStore.clearSession();
				navigate('/error', {
					replace: true,
					state: {
						code: 404,
						message: '세션을 찾지 못했습니다. 이미 종료된 세션일 가능성이 높습니다.'
					}
				});
			});
		loadModels();
	}, []);

	const loadModels = async () => {
		await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
		await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
		await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
		await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
	}

	const startFaceAnalyze = () => {
		if (intervalId.current !== null) {
			return;
		}
		intervalId.current = window.setInterval(async () => {
			if (!videoRef.current) {
				return;
			}
			const detections = await faceapi
			.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceExpressions();

			if (detections.length >= 1) {
				const happyScore = detections[0].expressions.happy;
				const intScore = Math.floor(happyScore*100);
				setScores([...scores, intScore]);
			}
			setLastEmotion(detections[0].expressions.asSortedArray()[0]);
	
		}, 1000);
	}
	const stopFaceAnalyze = () => {
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	}

	const [timer, setTimer] = useState(-1);
	const allowTime = useRef(0);
	const [disableNextButton, setDisableNextButton] = useState(false);
	useEffect(() => {
		if(timer <0) {
			return;
		}
		if (timer > allowTime.current) {
			setDisableNextButton(true);
		} 
		else {
		setDisableNextButton(false);
		}
		const interval = setInterval(() => {
		  	if (timer > 0) {
				setTimer((prevTimer) => prevTimer - 1);
		  	}
			else {
				clearInterval(interval);
				moveToNextState();
		  	}
		}, 1000);
		return () => {clearInterval(interval)};
	  }, [timer]);

	const moveToNextState= () => {
		//setDisableNextButton(false);
		if(stage=="Start" || stage=="Wait"){
			return startQuestion();
		}
		if(stage=='Question'){
			return startAnswer();
		}
		if(stage=="Answer"){
			return stopAnswer();
		}
	}

	const setPresetQuestions = async () => {
		//const response = await localAxios.get('basic-question');
		//const presetQuestions = response.data;
		const presetQuestions = [
			"1분 자기소개 해주세요.",
			"본인이 지원한 직무에 대해 설명해주세요.",
			"본인이 가장 잘한 프로젝트에 대해 설명해주세요.",
			"본인이 가장 어려웠던 프로젝트에 대해 설명해주세요.",
			"본인이 가장 자신있는 기술에 대해 설명해주세요.",
			"본인이 가장 부족하다고 생각하는 기술에 대해 설명해주세요.",
			"본인이 가장 중요하다고 생각하는 가치에 대해 설명해주세요.",
			"인생에서 가장 힘들었던 경험이 무엇인가요?",
			"왜 이 직무를 선택했나요?",
			"동료, 친구들이 나를 어떤 사람으로 생각할까요?",
			"본인의 장단점에 대해 설명해주세요.",
			"평소에 스트레스를 해소하는 방법은 무엇인가요?",
			"본인이 가장 좋아하는 책은 무엇인가요?",
			"본인의 취미는 무엇인가요?",
			"왜 굳이 우리 회사에 지원하려고 하나요?",
			"동료가 잘못을 했을 때 어떻게 조치할 것인가요?"
		];

		// presetQuestions 중에서 랜덤으로 5개를 뽑아서 interviewSessionStore에 저장
		const randomQuestions = presetQuestions.sort(() => Math.random() - Math.random()).slice(0, 5);
		setCurrentQuestion(randomQuestions[0]);
		interviewSessionStore.setQuestions(randomQuestions.map((question) => ({ question, answer: '' })));
	};

	const startQuestion = () => {
		setStage('Question');
		allowTime.current = 10;
		setTimer(20);
	};

	const startAnswer = async () => {
		const response = await localAxios.post('openvidu/recording/start/' + interviewSessionStore.sessionId)
		console.log(response);
		console.log("answer start");
		setStage('Answer');
		allowTime.current = 10;
		setTimer(30);
		
		startFaceAnalyze();
	};

	const stopAnswer = async () => {
		const response = await localAxios.post('openvidu/recording/stop/' + interviewSessionStore.sessionId)
		console.log(response);
		console.log("answer stop");

		interviewSessionStore.questions[questionCursor.current].answer = response.data.text;

		console.log(interviewSessionStore.questions)
		
		questionCursor.current += 1;
		if(questionCursor.current >= interviewSessionStore.questions.length) {
			setStage('End');
		} else {
			setCurrentQuestion(interviewSessionStore.questions[questionCursor.current].question);
			allowTime.current = 20;
			setStage('Wait')
			setTimer(20);
		}
		stopFaceAnalyze();
	};

	// Connection을 생성해주는 함수
	// 면접 페이지에서는 따로 다인 세션을 생성하지 않으므로, 페이지 진입시 session 생성
	const createConnection = async (sessionId: string) => {
		const response = await localAxios.post('openvidu/sessions/' + sessionId + '/connections', {}, {
			headers: { 'Content-Type': 'application/json', },
		});

		return response.data;
	}

	const initSession = useCallback(async () => {
		let ov = new OpenVidu();
		if (session !== null) return;
		if (!ov) return;

		const mySession = ov.initSession();

		console.log("init");
		mySession.on('streamCreated', (event) => {
			const subscriber = mySession.subscribe(event.stream, undefined);
			setSubscribers((prevSubscribers) => [ ...prevSubscribers, subscriber ]);
		});

		mySession.on('streamDestroyed', (event) => {
			deleteSubscriber(event.stream.streamManager);
		});

		mySession.on('exception', (exception) => {
			console.warn(exception);
		});

		setSession(mySession);

		if (!interviewSessionStore.sessionId) {
			navigate('/error/404');
			return;
		}

		const sessionId = interviewSessionStore.sessionId;
		const connectionData = await createConnection(sessionId);

		interviewSessionStore.setConnection(
			connectionData.connectionId,
			connectionData.token
		);

		console.log(interviewSessionStore);

		await mySession.connect(connectionData.token);
		const _publisher = await ov.initPublisherAsync(undefined, {
			audioSource: undefined,
			videoSource: undefined,
			publishAudio: audioEnabled,
			publishVideo: videoEnabled,
			resolution: '640x480',
			frameRate: 30,
			insertMode: 'APPEND',
			mirror: true
		});

		await mySession.publish(_publisher);

		let devices = await ov.getDevices();
		let videoDevices = devices.filter(device => device.kind === 'videoinput');
		let currentVideoDeviceId = _publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
		const _currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

		setMainStreamManager(_publisher);
		setPublisher(_publisher);
		setCurrentVideoDevice(_currentVideoDevice);

		console.log(_publisher);

		setOV(ov);
	}, [interviewSessionStore]);

	useEffect(() => {
        if (mainStreamManager && videoRef.current) {
            mainStreamManager.addVideoElement(videoRef.current);
        }
    }, [mainStreamManager]);

	const deleteSubscriber = useCallback((streamManager: StreamManager) => {
		setSubscribers((prevSubscribers) => {
			const index = prevSubscribers.indexOf(streamManager);
			if (index > -1) {
				const newSubscribers = [...prevSubscribers];
				newSubscribers.splice(index, 1);
				return newSubscribers;
			} else {
				return prevSubscribers;
			}
		});
	}, [subscribers]);

	const toggleVideo = useCallback(() => {
		setVideoEnabled(!videoEnabled);

		console.log(mainStreamManager);
		if (publisher) publisher.publishVideo(videoEnabled);
	}, [videoEnabled]);

	const toggleAudio = useCallback(() => {
		setAudioEnabled(!audioEnabled);

		if (publisher) publisher.publishAudio(audioEnabled);
	}, [audioEnabled]);

	return (
		<div className='p-10 w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col'>
			<div className='session-header flex justify-end'>
				<CustomButton size='lg' color='negative'>
					면접 종료
				</CustomButton>
			</div>
			<div className='session-title flex justify-center mt-6 text-3xl'>
				{
					stage=='Start' ? '면접 연습을 시작하려면 시작 버튼을 눌러주세요.' :
					stage=='Wait' ? '다음 답변이 준비되셨으면 다음을 눌러주세요.' : 
					stage=='Question' ? currentQuestion :
					stage=='Answer' ? currentQuestion :
					stage=='End' ? "종료" :
					'에러 발생'
				}
			</div>
			<div className='session-body flex-1 p-10'>
				<div className='session-content grid grid-cols-2 flex-1'>
					<div className='session-screen flex flex-col items-center justify-center'>
						<div className='session-screen-container flex flex-col'>
							<div className='session-screen-header flex justify-end py-3 gap-4'>
								<div className='session-indicator-expression flex gap-2 items-center'>
									<span className='text-xl font-semibold'>표정</span>
									<span className='material-symbols-outlined text-yellow-400 text-5xl'>
										{
											lastEmotion.expression === 'happy' ? 'sentiment_very_satisfied' :
											lastEmotion.expression === 'neutral' ? 'sentiment_neutral' :
											lastEmotion.expression === 'sad' ? 'sentiment_sad' :
											lastEmotion.expression === 'angry' ? 'sentiment_extremely_dissatisfied' :
											lastEmotion.expression === 'fearful' ? 'sentiment_stressed' :
											lastEmotion.expression === 'disgusted' ? 'sentiment_dissatisfied' :
											lastEmotion.expression === 'surprised' ? 'sentiment_frustrated' :
											""
										}
									</span>
									<span className='text-xl font-semibold'>Score: </span>
									<span className='text-xl font-semibold'>{scores[scores.length - 1]}</span>
								</div>
								{/* <div className='session-indicator-voice flex gap-2 items-center'>
									<span className='text-xl font-semibold'>발음</span>
									<span className='material-symbols-outlined text-yellow-400 text-5xl'>
										sentiment_satisfied
									</span>
								</div> */}
							</div>
							{
								<video autoPlay={true} ref={videoRef} />
							}
						</div>
					</div>
					<div className='session-ui'>
						{
							interviewSessionStore.questions.slice(0, questionCursor.current).map((question, index) => {
								return (
									<div key={index}>
										<div className='w-full flex justify-start border-b-2 border-gray-500'>
											<div className='session-question flex justify-center items-center'>
												{question.question}
											</div>
										</div>
										<div className='w-full flex justify-end border-b-2 border-gray-500'>
											<div className='session-answer flex justify-center items-center'>
												{question.answer}
											</div>
										</div>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
			<div className='session-footer flex justify-center'>
				<Button color='blue' onClick={toggleAudio}>마이크 토글</Button>
				<Button color='blue' onClick={toggleVideo}>카메라 토글</Button>
				<Button color='blue' disabled={disableNextButton} onClick={moveToNextState}>
					{
						stage=='Start' ? "시작" :
						stage=='Wait' ? "다음" :
						stage=='Question' ? "답변 시작" :
						stage=='Answer' ? "답변 종료" :
						stage=='End' ? "나가기를 클릭해주세요." :
						"에러 발생"
					}
				</Button>
				{timer >0 ? timer : ""}
			</div>
		</div>
	);
};
