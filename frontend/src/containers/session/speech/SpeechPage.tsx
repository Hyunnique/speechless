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

export const SpeechPage = () => {

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

	// 페이지 진입시 서비스 플로우 시작
	useEffect(() => {
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
	}, []);

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
		if(import.meta.env.VITE_USE_AI_API==="true"){
			await localAxios.post('interview/question', {
				interviewId: interviewSessionStore.interviewId,
				sessionId: sessionId,
				statementId: interviewSessionStore.statement!.id,
				questionCnt: interviewSessionStore.questionsCount
			});
		}

	}, [interviewSessionStore]);

	useEffect(() => {
        if (mainStreamManager && videoRef.current) {
            mainStreamManager.addVideoElement(videoRef.current);
        }
    }, [mainStreamManager]);

	const createConnection = async (sessionId: string) => {
		const response = await localAxios.post('openvidu/sessions/' + sessionId + '/connections', {}, {
			headers: { 'Content-Type': 'application/json', },
		});

		console.log(response);
		return response.data;
	}

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
	* 타이머 기능 --------------------------------------------------
	*/
	/*
	* 타이머 기능 끝 --------------------------------------------------
	*/


	/*
	* 상태 전이 기능 --------------------------------------------------
	*/

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
				{/* <div className='session-title flex justify-center text-5xl mt-5'>
					{
						interviewSessionStore.stage==='Start' ? '시작 버튼을 눌러주세요.' :
						interviewSessionStore.stage==='Wait' ? '준비되셨으면 다음을 눌러주세요.' : 
						interviewSessionStore.stage==='Question' ? currentQuestion :
						interviewSessionStore.stage==='Answer' ? currentQuestion :
						interviewSessionStore.stage==='End' ? "종료" :
						'에러 발생'
					}
				</div> */}
				<div className='session-body flex-1 mt-7'>
					<div className='session-content grid grid-cols-2 flex-1'>
						<div className='session-screen flex flex-col items-center justify-center'>
							<div className='session-screen-container flex flex-col'>
								<div className='session-screen-header flex justify-end py-3 gap-4'>
									{interviewSessionStore.stage === "Answer" 
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
							<div className='basis-5/6'>
							</div>
							<div className='basis-1/6 mt-5'>
								{/* <div className='flex justify-end'>
									<Button color='blue' disabled={disableNextButton} className='mr-12'>
										{
											interviewSessionStore.stage==='Start' ? "시작" :
											interviewSessionStore.stage==='Wait' ? "다음" :
											interviewSessionStore.stage==='Question' ? "답변 시작" :
											interviewSessionStore.stage==='Answer' ? "답변 종료" :
											interviewSessionStore.stage==='End' ? "나가기를 클릭해주세요." :
											"에러 발생"
										}
									</Button>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
