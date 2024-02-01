/* eslint-disable jsx-a11y/media-has-caption */

import { useEffect, useRef } from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

import { useLocalAxios } from '../../../utils/axios.ts';
import { useNavigate } from "react-router-dom";

import { useInterviewSessionStore } from "../../../stores/session.ts";
import {OpenVidu, Publisher, Session} from 'openvidu-browser';

export const InterviewPage = () => {

	const localAxios = useLocalAxios();
	const navigate = useNavigate();

	const interviewSessionStore = useInterviewSessionStore();

	const OV = new OpenVidu();
	let session: Session | null = null;
	const videoRef = useRef<HTMLVideoElement>(null);

	let videoEnabled = true;
	let audioEnabled = false;

	let currentVideoDevice = null;
	let mainStreamManager = null;
	let publisher: Publisher | null = null;

	// Connection을 생성해주는 함수
	// 면접 페이지에서는 따로 다인 세션을 생성하지 않으므로, 페이지 진입시 session 생성
	const createConnection = async (sessionId: string) => {
		const response = await localAxios.post('openvidu/sessions/' + sessionId + '/connections', {}, {
			headers: { 'Content-Type': 'application/json', },
		});

		return response.data;
	}

	const initSession = async () => {
		session = OV.initSession();

		if (!interviewSessionStore.sessionId) {
			navigate('/error/404');
			return;
		}
		console.log(interviewSessionStore);
		const sessionId = interviewSessionStore.sessionId;
		const connectionData = await createConnection(sessionId);

		interviewSessionStore.setConnection(
			connectionData.connectionId,
			connectionData.token
		);

		await session.connect(connectionData.token);
		publisher = await OV.initPublisherAsync(undefined, {
			audioSource: undefined,
			videoSource: undefined,
			publishAudio: audioEnabled,
			publishVideo: videoEnabled,
			resolution: '640x480',
			frameRate: 30,
			insertMode: 'APPEND',
			mirror: false
		});

		console.log("Hello");
		console.log(publisher);

		publisher.on('streamCreated', (event) => {
			session!.subscribe(event.stream, undefined);
		});

		const test = await session.publish(publisher);

		let devices = await OV.getDevices();
		let videoDevices = devices.filter(device => device.kind === 'videoinput');
		let currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
		currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

		mainStreamManager = publisher;

		mainStreamManager.addVideoElement(videoRef.current!);
		console.log("HELLO!!!!");
	}

	useEffect(() => {
		initSession().catch((error) => {
			console.error(error);
		});
	}, []);

	const toggleVideo = () => {
		videoEnabled = !videoEnabled;

		if (publisher) {
			publisher.publishVideo(videoEnabled);
		}
	}

	const toggleAudio = () => {
		audioEnabled = !audioEnabled;

		if (publisher) {
			publisher.publishAudio(audioEnabled);
		}
	}

	return (
		<div className='p-10 w-[100vw] h-[100vh] bg-gradient-to-b from-white to-gray-200 flex flex-col'>
			<div className='session-header flex justify-end'>
				<CustomButton size='lg' color='negative'>
					면접 종료
				</CustomButton>
			</div>
			<div className='session-title flex justify-center mt-6 text-3xl'>
				1분 자기소개 해주세요.
			</div>
			<div className='session-content grid grid-cols-2 flex-1'>
				<div className='session-screen flex flex-col items-center justify-center'>
					<div className='session-screen-container flex flex-col'>
						<div className='session-screen-header flex justify-end py-3 gap-4'>
							<div className='session-indicator-expression flex gap-1 items-center justify-end'>
								<span className='text-xl font-semibold'>표정</span>
								<span>
									<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
										 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											  d="M15 9h0M9 9h0m12 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM6.6 13a5.5 5.5 0 0 0 10.8 0H6.6Z"/>
									</svg>
								</span>
							</div>
							<div className='session-indicator-voice flex gap-1 items-center'>
								<span className='text-xl font-semibold'>발음</span>
								<span className='text-2xl'>
									<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
										 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
											  strokeWidth="2"
											  d="M15 9h0M9 9h0m12 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM6.6 13a5.5 5.5 0 0 0 10.8 0H6.6Z"/>
									</svg>
								</span>
							</div>
						</div>
						<video autoPlay={true} ref={videoRef} className="w-[640px] h-[480px] border-2 border-black" />
					</div>
				</div>
				<div className='session-ui'>

				</div>
			</div>
			<div className='session-footer flex justify-center'>
				<Button color='blue' onClick={toggleAudio}>마이크 토글</Button>
				<Button color='blue' onClick={toggleVideo}>카메라 토글</Button>
			</div>
		</div>
	);
};
