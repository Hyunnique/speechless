/* eslint-disable jsx-a11y/media-has-caption */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

import { useLocalAxios } from '../../../utils/axios.ts';
import { useNavigate } from 'react-router-dom';

import { useSpeechSessionStore } from '../../../stores/session.ts';
import { Device, OpenVidu, Publisher, Session, SignalEvent, StreamManager, Subscriber } from 'openvidu-browser';
import { OpenViduVideo } from '../../../components/OpenViduVideo.tsx';

import moment from 'moment';

//import { FaceAnalyzer } from '../../../utils/FaceAnalyzer.ts';
import * as faceapi from 'face-api.js';

export const SpeechPage = () => {
	const localAxios = useLocalAxios();
	const navigate = useNavigate();

	let sessionInterval: ReturnType<typeof setTimeout>;

	const speechSessionStore = useSpeechSessionStore();

	const videoRef = useRef<HTMLVideoElement>(null);
	const subscriberVideosRef = useRef<HTMLDivElement>(null);

	const [sessionTime, setSessionTime] = useState<number>(0);
	const [OV, setOV] = useState<OpenVidu | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [mainStreamManager, setMainStreamManager] = useState<StreamManager | null>(null);
	const [publisher, setPublisher] = useState<Publisher | null>(null);
	const [subscribers, setSubscribers] = useState<(Publisher | Subscriber | StreamManager)[]>([]);
	const [currentVideoDevice, setCurrentVideoDevice] = useState<Device | undefined>(undefined);

	const [videoEnabled, setVideoEnabled] = useState(true);
	const [audioEnabled, setAudioEnabled] = useState(true);

	// 페이지 진입시 서비스 플로우 시작
	useEffect(() => {
		initSession()
			.then(() => {})
			.catch((e) => {
				console.error(e);
				// 에러가 발생해서 session을 초기화하지 못했으므로 에러 페이지로 이동
				speechSessionStore.clearSession();
				navigate('/error', {
					replace: true,
					state: {
						code: 404,
						message: '세션을 찾지 못했습니다. 이미 종료된 세션일 가능성이 높습니다.',
					},
				});
			});
	}, []);

	const initSession = useCallback(async () => {
		const ov = new OpenVidu();
		if (session !== null) return;
		if (!ov) return;

		const mySession = ov.initSession();

		subscribers.forEach((subscriber, index) => {
			const video = document.createElement('video');
			video.autoplay = true;
			video.controls = false;
			video.id = `subscriberVideo_${index}`;
			subscriber.addVideoElement(video);
			subscriberVideosRef.current?.appendChild(video);
		});

		mySession.on('streamCreated', (event) => {
			const subscriber = mySession.subscribe(event.stream, 'session-ui');
			setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
		});

		mySession.on('streamDestroyed', (event) => {
			deleteSubscriber(event.stream.streamManager);
		});

		mySession.on('exception', (exception) => {
			console.warn(exception);
		});

		setSession(mySession);

		if (!speechSessionStore.sessionId) {
			navigate('/error/404');
			return;
		}

		const sessionId = speechSessionStore.sessionId;
		const connectionData = await createConnection(sessionId);

		speechSessionStore.setConnection(connectionData.connectionId, connectionData.token);

		await mySession.connect(connectionData.token);
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

		let devices = await ov.getDevices();
		let videoDevices = devices.filter((device) => device.kind === 'videoinput');
		let currentVideoDeviceId = _publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
		const _currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

		setMainStreamManager(_publisher);
		setPublisher(_publisher);
		setCurrentVideoDevice(_currentVideoDevice);

		setOV(ov);

		if (sessionInterval) clearInterval(sessionInterval);
		sessionInterval = setInterval(() => {
			setSessionTime(moment.duration(moment().diff(moment(speechSessionStore.detail?.sessionStart))).asSeconds());
		}, 1000);

		return () => {
			subscriberVideosRef.current?.childNodes.forEach((node) => {
				subscriberVideosRef.current?.removeChild(node);
			});
		};
	}, [speechSessionStore]);

	useEffect(() => {
		if (mainStreamManager && videoRef.current) {
			mainStreamManager.addVideoElement(videoRef.current);
		}
	}, [mainStreamManager]);

	const createConnection = async (sessionId: string) => {
		const response = await localAxios.post(
			'openvidu/announcement/' + sessionId + '/connections',
			{},
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);

		console.log(response);
		return response.data;
	};

	const deleteSubscriber = useCallback(
		(streamManager: StreamManager) => {
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
		},
		[subscribers],
	);

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

	const disconnectAndQuit = () => {
		session?.disconnect();
		setSession(null);
		setMainStreamManager(null);
		setPublisher(null);
		setSubscribers([]);
		speechSessionStore.clearSession();
		navigate('/');
	};

	// /*
	// * face-api 기능 --------------------------------------------------
	// */
	// const [lastEmotion, setLastEmotion] = useState({expression: '', probability: -1});
	// const [scores, setScores] = useState([] as number[]);
	// const intervalId = useRef<number | null>(null);
	// const modelUrl = '/models';

	// const loadModels = async () => {
	// 	await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
	// 	await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
	// 	await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
	// 	await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
	// }

	// const startFaceAnalyze = () => {
	// 	if (intervalId.current !== null) {
	// 		return;
	// 	}
	// 	intervalId.current = window.setInterval(async () => {
	// 		if (!videoRef.current) {
	// 			return;
	// 		}
	// 		const detections = await faceapi
	// 		.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
	// 		.withFaceLandmarks()
	// 		.withFaceExpressions();

	// 		if (detections.length >= 1) {
	// 			const happyScore = Math.floor(detections[0].expressions.happy*50);

	// 			let negativeScore = 0;
	// 			negativeScore += detections[0].expressions.sad;
	// 			negativeScore += detections[0].expressions.angry;
	// 			negativeScore += detections[0].expressions.fearful;
	// 			negativeScore += detections[0].expressions.disgusted;
	// 			negativeScore += detections[0].expressions.surprised;
	// 			negativeScore = Math.floor(negativeScore*50);

	// 			let score = 50 + happyScore - negativeScore;

	// 			setScores([...scores, score]);
	// 			setLastEmotion(detections[0].expressions.asSortedArray()[0]);
	// 		}

	// 	}, 1000);
	// }
	// const stopFaceAnalyze = () => {
	// 	if (intervalId.current) {
	// 		clearInterval(intervalId.current);
	// 		intervalId.current = null;
	// 	}
	// }

	// const clearFaceAnalyze = () => {
	// 	stopFaceAnalyze();
	// 	setScores([]);
	// }

	return (
		<div className='w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col items-center'>
			<div className='p-10 w-[90vw] h-[80vh]'>
				<div className='session-header flex justify-between items-center'>
					<div className='flex gap-5 text-lg'>
						<div className='flex items-center gap-2'>
							<span className='font-semibold'>방 제목</span>
							<span>{ speechSessionStore.detail?.title }</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<span className='text-2xl text-yellow-400'>
								<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
									<path
										fill='currentColor'
										d='M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14z'
									/>
								</svg>
							</span>
							<span className='font-semibold'>{ speechSessionStore.detail?.writer }</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='material-symbols-outlined'>person</span>
							<span>{subscribers.length + 1}</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='material-symbols-outlined'>timer</span>
							<span>
								{
									Math.floor(sessionTime / 60).toLocaleString('ko-KR', { minimumIntegerDigits: 2 })
									+ ':' +
									Math.floor(sessionTime % 60).toLocaleString('ko-KR', { minimumIntegerDigits: 2})
								}
							</span>
						</div>
					</div>
					<CustomButton onClick={disconnectAndQuit} size='lg' color='negative' className='mr-12'>
						발표 나가기
					</CustomButton>
				</div>
				<div className='session-body flex-1 mt-7'>
					<div className='session-content grid grid-cols-2 flex-1'>
						<div className='session-screen flex flex-col items-center justify-center'>
							<div className='session-screen-container flex flex-col'>
								<div className='session-screen-header flex justify-end py-3 gap-4'></div>
								<video autoPlay={true} ref={videoRef} />
								<div className='flex flex-row justify-center m-10 gap-16'>
									{audioEnabled ? (
										<Button
											className='rounded-full aspect-square bg-white border-2 border-black'
											onClick={toggleAudio}
										>
											<span className='material-symbols-outlined text-black text-3xl'>mic</span>
										</Button>
									) : (
										<Button
											className='rounded-full aspect-square bg-negative-500 border-2 border-black'
											onClick={toggleAudio}
										>
											<span className='material-symbols-outlined text-white text-3xl'>
												mic_off
											</span>
										</Button>
									)}
									{videoEnabled ? (
										<Button
											className='rounded-full aspect-square bg-white border-2 border-black'
											onClick={toggleVideo}
										>
											<span className='material-symbols-outlined text-black text-3xl'>
												screen_share
											</span>
										</Button>
									) : (
										<Button
											className='rounded-full aspect-square bg-negative-500 border-2 border-black'
											onClick={toggleVideo}
										>
											<span className='material-symbols-outlined text-white text-3xl'>
												stop_screen_share
											</span>
										</Button>
									)}
								</div>
							</div>
						</div>
						{subscribers.length <= 1 ? (
							<div id='session-ui' className='session-ui grid grid-cols-1 mt-7 gap-3'></div>
						) : subscribers.length <= 4 ? (
							<div id='session-ui' className='session-ui grid grid-cols-2 mt-7  gap-3'></div>
						) : (
							<div id='session-ui' className='session-ui grid grid-cols-4 mt-7  gap-3'></div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
