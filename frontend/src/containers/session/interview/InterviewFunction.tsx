import React, { useRef } from 'react';
import { FaceClass } from '../../../utils/FaceClass';

export const InterviewFUnction = () => {
	const [captureVideo, setCaptureVideo] = React.useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const videoHeight = 480;
	const videoWidth = 640;

	const faceAnalyzer = new FaceClass(videoRef);

	React.useEffect(() => {
		
	}, []);

	const startVideo = () => {
		setCaptureVideo(true);
		navigator.mediaDevices
			.getUserMedia({ video: { width: 300 } })
			.then((stream) => {
				const video = videoRef.current as unknown as HTMLVideoElement;
				if (video) {
					video.srcObject = stream;
					video.play();
				}
			})
			.then(() => {
				//faceFunction(videoRef);
				faceAnalyzer.start();
			})
			.catch((err) => {
				console.error('error:', err);
			});
	};

	const closeWebcam = () => {
		
		faceAnalyzer.stop();
        
		if (videoRef.current) {
		videoRef.current.pause();
			const mediaStream = videoRef.current.srcObject as MediaStream;
        	if (mediaStream) {
            	mediaStream.getTracks().forEach(track => track.stop());
        	}
        }
		setCaptureVideo(false);
	};

	return (
		<div>
			<div style={{ textAlign: 'center', padding: '10px' }}>
				{captureVideo ? (
					<button
						onClick={closeWebcam}
						style={{
							cursor: 'pointer',
							backgroundColor: 'green',
							color: 'white',
							padding: '15px',
							fontSize: '25px',
							border: 'none',
							borderRadius: '10px',
						}}
					>
						Close Webcam
					</button>
				) : (
					<button
						onClick={startVideo}
						style={{
							cursor: 'pointer',
							backgroundColor: 'green',
							color: 'white',
							padding: '15px',
							fontSize: '25px',
							border: 'none',
							borderRadius: '10px',
						}}
					>
						Open Webcam
					</button>
				)}
			</div>
			{captureVideo ? (

				<div>
					<div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
					<video
						ref={videoRef}
						height={videoHeight}
						width={videoWidth}
						style={{ borderRadius: '10px' }}
					>
						<track src="captions_en.vtt" kind="captions" srcLang="en" label="English captions" />
						</video>
					</div>
				</div>

			) : (
				<></>
			)}
		</div>
	);
};
