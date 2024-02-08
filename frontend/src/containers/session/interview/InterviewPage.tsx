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
		interviewSessionStore.setQuestions(questionsRef.current);
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
		//if(import.meta.env.VITE_USE_AI_API==="true"){
			await localAxios.post('interview/question', {
				interviewId: interviewSessionStore.interviewId,
				sessionId: sessionId,
				statementId: interviewSessionStore.statement!.id,
				questionCnt: interviewSessionStore.questionsCount
			});
		//}

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
				interviewSessionStore.setQuestions(questionsRef.current);
				setCurrentQuestion(questionsRef.current[questionCursor.current].question);
			}
			if(e.type==="signal:feedback"){
				const data = JSON.parse(e.data);
				console.log(feedbackCursor.current +"   ..   " + data.feedback);
				questionsRef.current[feedbackCursor.current].feedback = data.feedback;
				interviewSessionStore.setQuestions(questionsRef.current);
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
		//if(import.meta.env.VITE_USE_AI_API==="true"){
			const response = await localAxios.post('openvidu/recording/start/' + interviewSessionStore.sessionId)
			interviewSessionStore.setRecordingId(response.data);
		//}
		console.log("answer start");
		setStage('Answer');
		restartTimer(60, 55);
		
		startFaceAnalyze();
	};

	const stopAnswer = async () => {
		stopFaceAnalyze();
		//if(import.meta.env.VITE_USE_AI_API==="true"){
			const response = await localAxios.post('openvidu/recording/stop/' + interviewSessionStore.recordingId, {
				interviewId: interviewSessionStore.interviewId,
				question: questionsRef.current[questionCursor.current].question
			})
	
			questionsRef.current[questionCursor.current].answer = response.data.text;
			questionsRef.current[questionCursor.current].faceScore = Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
			questionsRef.current[questionCursor.current].speechScore = Math.floor(response.data.confidence * 100);
			interviewSessionStore.setQuestions(questionsRef.current);
		//}
		// else{
		// 	questionsRef.current[questionCursor.current].answer = 
		// 	`
		// 	저는 프론트엔드 개발자로 지원하게 된 이유는 제 관심과 열정이 웹 개발 분야에 깊게 뿌리를 두고 있기 때문입니다. 여러 가지 이유로 프론트엔드 개발에 대한 열정을 키워왔습니다.
		// 	우선적으로, 저는 사용자 경험을 개선하고 사용자들에게 가치를 제공하는 기술을 만들기에 흥미를 느낍니다. 프론트엔드 개발은 이를 달성하는 데 중요한 역할을 합니다. 웹 사이트나 애플리케이션의 디자인과 사용자 인터페이스를 개선함으로써 사용자들이 보다 쉽고 효과적으로 목적을 달성할 수 있도록 돕는 것이 목표입니다.
		// 	또한, 프론트엔드 개발은 창의성과 문제 해결 능력을 요구하는 분야입니다. 디자인과 기술적인 요소를 결합하여 사용자들에게 매력적인 경험을 제공하기 위해 새로운 아이디어를 고안하고 구현하는 과정에서 큰 만족감을 느낍니다. 또한, 프론트엔드 개발에서 발생하는 다양한 문제들을 해결하는 과정에서 끊임없는 학습과 성장이 가능하다고 생각합니다.
		// 	또한, 현재의 프론트엔드 기술은 계속해서 발전하고 있습니다. 새로운 프레임워크, 라이브러리, 도구들이 등장함에 따라 개발자로서 항상 새로운 것을 배우고 적용하는 것이 필요합니다. 이러한 도전과 성장의 기회를 통해 더 나은 개발자로 성장할 수 있다고 믿습니다.
		// 	마지막으로, 프론트엔드 개발은 협업과 소통이 중요한 분야입니다. 디자이너, 백엔드 개발자, 프로젝트 매니저 등과의 원활한 커뮤니케이션을 통해 팀으로서의 목표를 달성하는 과정에서 제 역량을 발휘하고 싶습니다.
		// 	이러한 이유들로 인해 저는 프론트엔드 개발자로 지원하게 되었으며, 이 직무에서 제 역량을 발휘하여 회사의 성공에 기여하고 싶습니다.
		// 	`

		// 	questionsRef.current[feedbackCursor.current].feedback = 
		// 	`
		// 	이 답변은 프론트엔드 개발자로의 지원 동기를 명확하게 전달하고 있습니다. 지원자는 자신의 관심과 열정이 웹 개발 분야에 깊게 뿌리를 두고 있다고 설명하며, 프론트엔드 개발이 사용자 경험을 개선하고 가치를 제공하는 기술을 만드는 과정에 흥미를 느끼고 있다고 강조하고 있습니다.
		// 	특히, 사용자 중심의 접근 방식과 창의성, 문제 해결 능력이 프론트엔드 개발에서 요구되는 요소라고 잘 제시하였습니다. 또한, 기술의 지속적인 발전과 이에 대한 학습에 대한 의지와 협업과 소통이 중요하다는 것을 강조하여 자신의 성장과 회사의 성공에 기여하고자 하는 의지를 잘 드러내었습니다.
		// 	답변은 구체적이고 직접적으로 이유를 제시하여 설득력을 높이고 있으며, 프론트엔드 개발자로의 역량과 기여에 대한 자신감을 잘 전달하고 있습니다. 전반적으로 훌륭한 지원 동기를 나타내는 답변입니다.
		// 	이 답변을 더욱 강화하고 개선하기 위해 몇 가지 아이디어가 있습니다.
		// 	구체적인 예시 추가: 프론트엔드 개발에 흥미를 갖게 된 구체적인 경험 또는 프로젝트에 대한 언급을 추가하여, 지원자가 어떻게 이러한 열정을 발전시켰는지를 더 잘 보여줄 수 있습니다.
		// 	회사와의 연결: 회사의 제품 또는 서비스와 관련하여 언급하면 더 맞춤화된 지원 동기를 제시할 수 있습니다. 회사의 가치관이나 제품에 대한 관심을 나타내면 지원자의 적합성을 강조할 수 있습니다.
		// 	미래 비전 포함: 프론트엔드 개발자로서의 미래 비전이나 목표를 논의하여, 회사와의 장기적인 일치를 강조할 수 있습니다. 이는 회사에 대한 더 깊은 관심과 심각성을 나타내며, 장기적인 협력 가능성을 보여줄 수 있습니다.
		// 	간결함과 명확함: 답변을 더 간결하고 명확하게 만들어 지원 동기를 더 직관적으로 전달할 수 있습니다. 불필요한 구절이나 중복된 내용을 줄이고, 핵심 아이디어를 강조합니다.
		// 	자기개발에 대한 계획: 프론트엔드 개발 분야에서의 자기개발 계획이나 관련 교육, 자격증 취득 등에 대한 계획을 언급하여, 지원자가 지속적인 성장에 대한 의지를 강조할 수 있습니다.
		// 	이러한 방법을 사용하여 답변을 더욱 강화하고 지원 동기를 뚜렷하게 전달할 수 있을 것입니다.
		// 	`
		// 	feedbackCursor.current+=1;
		// }

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
		<div className='w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col items-center'>
			<div className='p-10 w-[90vw] h-[80vh]'>
				<div className='session-header flex justify-end'>
					<CustomButton onClick={()=>{navigate('/interview')}} size='sm' color='negative' className='mr-12'>
						면접 종료
					</CustomButton>
				</div>
				<div className='session-title flex justify-center text-5xl mt-5'>
					{
						stage==='Start' ? '면접 연습을 시작하려면 시작 버튼을 눌러주세요.' :
						stage==='Wait' ? '다음 답변이 준비되셨으면 다음을 눌러주세요.' : 
						stage==='Question' ? currentQuestion :
						stage==='Answer' ? currentQuestion :
						stage==='End' ? "종료" :
						'에러 발생'
					}
				</div>
				<div className='session-body flex-1 mt-7'>
					<div className='session-content grid grid-cols-2 flex-1'>
						<div className='session-screen flex flex-col items-center justify-center'>
							<div className='session-screen-container flex flex-col'>
								<div className='session-screen-header flex justify-end py-3 gap-4'>
									{stage === "Answer" 
										?
										<div className='session-indicator-expression flex gap-2 items-center'>
											<span className='text-3xl font-semibold'>표정</span>
											<span className='material-symbols-outlined text-yellow-400 text-2xl'>
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
											<span className='text-2xl font-semibold'>Score: </span>
											<span className='text-2xl font-semibold'>{scores.length > 0 ? scores[scores.length - 1].toFixed(0).padStart(2, ' ') : "  "}</span>
										</div> 
										:
										<div className='session-indicator-expression flex gap-2 items-center'>
											<span className='text-3xl invisible'>'</span>
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
							<div className='h-[65vh] mr-12 mt-20 gird grid-cols-1 items-center overflow-auto'>
								{
									stage==="Wait"? 
										interviewSessionStore.questions.slice(0, questionCursor.current).map((question, index) => {
											return (
												<div key={index} className='mt-4'>
													<div className='w-full flex justify-start border-b-2 border-gray-500'>
														<div className='session-question flex justify-center items-cente1r'>
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
									<div className="flex justify-center items-center">
										<CountdownCircleTimer
											key={uniqueKey}
											isPlaying={timerOn || false}
											duration={duration || 999}
											colors={['#004777', '#F7B801', '#A30000', '#A30000']}
											colorsTime={[60, 45, 20, 0]}
											onUpdate={timerOnUpdate}
											strokeWidth={20}
											size={460}
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
							<div className='basis-1/6 mt-5'>
								<div className='flex justify-end'>
									<Button color='blue' disabled={disableNextButton} onClick={moveToNextState} className='mr-12'>
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
