/* eslint-disable jsx-a11y/media-has-caption */

import {useCallback, useEffect, useRef, useState} from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

import { useLocalAxios } from '../../../utils/axios.ts';
import { useNavigate } from "react-router-dom";

import { useInterviewSessionStore } from "../../../stores/session.ts";
import {Device, OpenVidu, Publisher, Session, SignalEvent, StreamManager, Subscriber} from "openvidu-browser";
import {OpenViduVideo} from "../../../components/OpenViduVideo.tsx";

//import { FaceAnalyzer } from '../../../utils/FaceAnalyzer.ts';
import * as faceapi from 'face-api.js';

import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { InterviewQuestion } from '../../../types/Interview.ts';

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
	
	const questionsRef = useRef<InterviewQuestion[]>([]);
	const questionCursor = useRef(0);
	const feedbackCursor = useRef(0);

	const voicesRef = useRef<SpeechSynthesisVoice[]>();

	// 페이지 진입시 서비스 플로우 시작
	useEffect(() => {
		setPresetQuestions();
		initSession()
			.then(() => {
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
		
		//TTS 설정
		const setVoices = () => {
			voicesRef.current = window.speechSynthesis.getVoices();
		};
		setVoices();
		window.speechSynthesis.onvoiceschanged = setVoices; // 목소리 변경 시 이벤트 리스너 설정

		//타이머 설정
		stopTimer();

		//전이 상태 Start로 설정
		setStage('Start')

		return () => {
			window.speechSynthesis.onvoiceschanged = null; // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
		};

	}, []);

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

		// presetQuestions 중에서 랜덤으로 뽑아서 interviewSessionStore에 저장
		const questionsCount = interviewSessionStore.questionsCount;
		const randomQuestions = presetQuestions.sort(() => Math.random() - Math.random()).slice(0, questionsCount);
		setCurrentQuestion(randomQuestions[0]);
		questionsRef.current = randomQuestions.map((question) => ({ question, answer: '', feedback: '', faceScore: 0, speechScore: 0}));
	};
	// Connection을 생성해주는 함수
	// 면접 페이지에서는 따로 다인 세션을 생성하지 않으므로, 페이지 진입시 session 생성
	const createConnection = async (sessionId: string) => {
		const response = await localAxios.post('openvidu/sessions/' + sessionId + '/connections', {}, {
			headers: { 'Content-Type': 'application/json', },
		});

		console.log(response);
		return response.data;
	}

	const initSession = useCallback(async () => {
		const ov = new OpenVidu();
		if (session !== null) return;
		if (!ov) return;

		const mySession = ov.initSession();

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

		//console.log(interviewSessionStore);

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

		//console.log(_publisher);

		setOV(ov);
		if(import.meta.env.VITE_USE_AI_API===true){
			await localAxios.post('interview/question', {
				interviewId: interviewSessionStore.interviewId,
				sessionId: sessionId,
				statementId: interviewSessionStore.statement!.id,
				questionCnt: interviewSessionStore.questionsCount
			});
		}

		mySession.on('signal', (e)=>{
			console.log(e)
			if(!e.data){
				return;
			}
			if(e.type==="signal:question"){
				const list = JSON.parse(e.data);
				const cleanedList = list.map((item: string) => item.replace(/^\d+\.\s+/, '').replace(/\\n$/, ''));
				const questions = [];
				for(let index = 0; index <questionCursor.current+1; index++){
					questions.push(questionsRef.current[index]);
				}
				for(let index = questionCursor.current+1; index < cleanedList.length; index++){
					questions.push({question: cleanedList[index], answer: '', feedback: '', faceScore: 0, speechScore: 0});
				}
				console.log("디버그");
				console.log(questions);
				questionsRef.current = questions;

				setCurrentQuestion(questionsRef.current[questionCursor.current].question);
			}
			if(e.type==="signal:feedback"){
				const data = JSON.parse(e.data);
				questionsRef.current[feedbackCursor.current].feedback = data.feedback;
				feedbackCursor.current +=1;
			}
		});

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

	const toggleVideo = () => {
		if (publisher) {
			publisher.publishVideo(!videoEnabled);
			setVideoEnabled(!videoEnabled);
		}
	};

	const toggleAudio = () => {
		if (publisher) {
			publisher.publishAudio(!audioEnabled);
			setAudioEnabled(!audioEnabled);
		}
	};


	/*
	* face-api 기능 --------------------------------------------------
	*/
	const [lastEmotion, setLastEmotion] = useState({expression: '', probability: -1}); 
	const [scores, setScores] = useState([] as number[]);
	const intervalId = useRef<number | null>(null);
	const modelUrl = '/models';

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
				const happyScore = Math.floor(detections[0].expressions.happy*50);
				
				let negativeScore = 0;
				negativeScore += detections[0].expressions.sad;
				negativeScore += detections[0].expressions.angry;
				negativeScore += detections[0].expressions.fearful;
				negativeScore += detections[0].expressions.disgusted;
				negativeScore += detections[0].expressions.surprised;
				negativeScore = Math.floor(negativeScore*50);

				let score = 50 + happyScore - negativeScore;
				
				setScores([...scores, score]);
				setLastEmotion(detections[0].expressions.asSortedArray()[0]);
			}
	
		}, 1000);
	}
	const stopFaceAnalyze = () => {
		if (intervalId.current) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
	}

	const clearFaceAnalyze = () => {
		stopFaceAnalyze();
		setScores([]);
	}
	/*
	* face-api 기능 끝 --------------------------------------------------
	*/


	/*
	* TTS 기능 --------------------------------------------------
	*/
	const speech = (txt: string) => {
		const lang = "ko-KR";
		const utterThis = new SpeechSynthesisUtterance(txt);
	  
		utterThis.lang = lang;
	  
		// voicesRef.current 확인
		if (!voicesRef.current || voicesRef.current.length === 0) {
		  voicesRef.current = window.speechSynthesis.getVoices();
		}
	  
		const kor_voice = voicesRef.current.find(
		  (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
		);
	  
		if (kor_voice) {
		  utterThis.voice = kor_voice;
		} else {
		  console.log("한국어 목소리를 찾을 수 없습니다.");
		  return;
		}
	  
		window.speechSynthesis.speak(utterThis);
	};
	/*
	* TTS 기능 끝 --------------------------------------------------
	*/


	/*
	* 타이머 기능 --------------------------------------------------
	*/
	const [uniqueKey, setUniqueKey] = useState(-1);
	const [duration, setDuration] = useState<number>();
	const [clickAllowTime, setClickAllowTime] = useState<number>();
	const [remainingTime, setRemainingTime] = useState<number>();
	const [timerOn, setTimerOn] = useState(false);
	const [disableNextButton, setDisableNextButton] = useState(false);

	const stopTimer = () => {
		setTimerOn(false);
		setDuration(999);
		setClickAllowTime(999);
	}

	const restartTimer = (duration: number, clickAllowTime: number) => {
		setDuration(duration);
		setClickAllowTime(clickAllowTime);
		console.log("타이머 리스타트")
		setTimerOn(true);
		setUniqueKey(prevKey => prevKey + 1);
	};

	const timerOnUpdate = (remainingTime: number) => {
		setRemainingTime(remainingTime)
	}

	useEffect(() => {
		refreshButtonClickState();
	}, [duration])
	
	useEffect(() => {
		refreshButtonClickState();
		if(remainingTime === 0) {
			moveToNextState();
		}

	}, [remainingTime]);

	const refreshButtonClickState = () => {
		if(!remainingTime || !clickAllowTime) {
			return;
		}

		if (remainingTime > clickAllowTime) {
			setDisableNextButton(true);
		} 
		else {
			setDisableNextButton(false);
		}
	}
	/*
	* 타이머 기능 끝 --------------------------------------------------
	*/


	/*
	* 상태 전이 기능 --------------------------------------------------
	*/
	const [ stage, setStage ] = useState<string>();

	const startQuestion = () => {
		speech(questionsRef.current[questionCursor.current].question);
		setStage('Question');
		restartTimer(15, 10);
	};

	const startAnswer = async () => {
		if(import.meta.env.VITE_USE_AI_API===true){
			const response = await localAxios.post('openvidu/recording/start/' + interviewSessionStore.sessionId)
			interviewSessionStore.setRecordingId(response.data);
		}
		console.log("answer start");
		setStage('Answer');
		restartTimer(60, 55);
		
		startFaceAnalyze();
	};

	const stopAnswer = async () => {
		stopFaceAnalyze();
		if(import.meta.env.VITE_USE_AI_API===true){
			const response = await localAxios.post('openvidu/recording/stop/' + interviewSessionStore.recordingId, {
				interviewId: interviewSessionStore.interviewId,
				question: questionsRef.current[questionCursor.current].question
			})
	
			questionsRef.current[questionCursor.current].answer = response.data.text;
			questionsRef.current[questionCursor.current].faceScore = Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
			questionsRef.current[questionCursor.current].speechScore = Math.floor(response.data.confidence * 100);
		}

		clearFaceAnalyze();
		
		questionCursor.current += 1;
		if(questionCursor.current >= questionsRef.current.length) {
			setStage('End');
		} else {
			setCurrentQuestion(questionsRef.current[questionCursor.current].question);
			stopTimer();
			setStage('Wait')

		}
	};

	const moveToNextState= () => {
		if(stage==="Start" || stage==="Wait"){
			return startQuestion();
		}
		if(stage==='Question'){
			return startAnswer();
		}
		if(stage==="Answer"){
			return stopAnswer();
		}
	}
	/*
	* 상태 전이 기능 끝 --------------------------------------------------
	*/

	return (
		<div className='p-10 w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col items-center'>
			<div className='w-5/6'>
				<div className='session-header flex justify-end'>
					<CustomButton size='lg' color='negative'>
						면접 종료
					</CustomButton>
				</div>
				<div className='session-title flex justify-center mt-6 text-3xl'>
					{
						stage==='Start' ? '면접 연습을 시작하려면 시작 버튼을 눌러주세요.' :
						stage==='Wait' ? '다음 답변이 준비되셨으면 다음을 눌러주세요.' : 
						stage==='Question' ? currentQuestion :
						stage==='Answer' ? currentQuestion :
						stage==='End' ? "종료" :
						'에러 발생'
					}
				</div>
				<div className='session-body flex-1 p-10'>
					<div className='session-content grid grid-cols-2 flex-1'>
						<div className='session-screen flex flex-col items-center justify-center'>
							<div className='session-screen-container flex flex-col'>
								<div className='session-screen-header flex justify-end py-3 gap-4'>
									{stage === "Answer" 
										?
										<div className='session-indicator-expression flex gap-2 items-center'>
											<span className='text-5xl font-semibold'>표정</span>
											<span className='material-symbols-outlined text-yellow-400 text-5xl'>
												{
													lastEmotion.expression === 'happy' ? 'sentiment_very_satisfied' :
													lastEmotion.expression === 'neutral' ? 'sentiment_neutral' :
													lastEmotion.expression === 'sad' ? 'sentiment_sad' :
													lastEmotion.expression === 'angry' ? 'sentiment_extremely_dissatisfied' :
													lastEmotion.expression === 'fearful' ? 'sentiment_stressed' :
													lastEmotion.expression === 'disgusted' ? 'sentiment_dissatisfied' :
													lastEmotion.expression === 'surprised' ? 'sentiment_frustrated' :
													'sentiment_neutral'
												}
											</span>
											<span className='text-3xl font-semibold'>Score: </span>
											<span className='text-3xl font-semibold'>{scores.length > 0 ? scores[scores.length - 1].toFixed(0).padStart(2, ' ') : "  "}</span>
										</div> 
										:
										<div className='session-indicator-expression flex gap-2 items-center'>
											<span className='text-5xl invisible'>'</span>
										</div>
									}
								</div>
								<video autoPlay={true} ref={videoRef} />
								<div className='flex flex-row justify-center m-10 gap-16'>
									{
										audioEnabled ?
										<Button className='rounded-full aspect-square bg-white border-2 border-black' onClick={toggleAudio}>
											<span className='material-symbols-outlined text-black text-3xl'>
												mic
											</span>
										</Button>
										:
										<Button className='rounded-full aspect-square bg-negative-500 border-2 border-black' onClick={toggleAudio}>
												<span className='material-symbols-outlined text-white text-3xl'>
													mic_off
												</span>
										</Button>
									}
									{
										videoEnabled ?
										<Button className='rounded-full aspect-square bg-white border-2 border-black' onClick={toggleVideo}>
												<span className='material-symbols-outlined text-black text-3xl'>
													screen_share
												</span>
										</Button>
										:
										<Button className='rounded-full aspect-square bg-negative-500 border-2 border-black' onClick={toggleVideo}>
												<span className='material-symbols-outlined text-white text-3xl'>
													stop_screen_share
												</span>
										</Button>
									}
								</div>
							</div>
						</div>
						<div className='session-ui flex flex-col'>
							<div className='basis-5/6 gird grid-cols-1 items-center'>
								{
									stage==="Wait"? 
										questionsRef.current.slice(0, questionCursor.current).map((question, index) => {
											return (
												<div key={index} className='mt-4'>
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
													<div className='w-full flex justify-end border-b-2 border-gray-500'>
														<div className='session-answer flex justify-center items-center'>
															{question.feedback}
														</div>
													</div>
													<div className='w-full flex justify-end border-b-2 border-gray-500'>
														<div className='session-answer flex justify-center items-center'>
															표정 점수: {question.faceScore} &nbsp; 발음 점수: {question.speechScore}
														</div>
													</div>
												</div>
											);
										})
			
									:

									stage==="Question"|| stage==="Answer"? 
									<div className="flex justify-center items-center mt-16">
										<CountdownCircleTimer
											key={uniqueKey}
											isPlaying={timerOn || false}
											duration={duration || 999}
											colors={['#004777', '#F7B801', '#A30000', '#A30000']}
											colorsTime={[60, 45, 20, 0]}
											onUpdate={timerOnUpdate}
											strokeWidth={20}
											size={480}
										>
											{({ remainingTime }) => (
												<div className="text-5xl font-bold">
													{remainingTime}
												</div>
											)}
										</CountdownCircleTimer>
									</div>

									:

									""
								}
							</div>
							<div className='basis-1/6'>
								<div className='flex justify-end'>
									<Button color='blue' disabled={disableNextButton} onClick={moveToNextState}>
										{
											stage==='Start' ? "시작" :
											stage==='Wait' ? "다음" :
											stage==='Question' ? "답변 시작" :
											stage==='Answer' ? "답변 종료" :
											stage==='End' ? "나가기를 클릭해주세요." :
											"에러 발생"
										}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
