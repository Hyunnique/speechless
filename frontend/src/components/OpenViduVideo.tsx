/* eslint-disable jsx-a11y/media-has-caption */

import React, { useEffect, useRef } from 'react';
import { Publisher, StreamManager } from 'openvidu-browser';

interface OVProps {
	streamManager: StreamManager;
}

export const OpenViduVideo: React.FC<OVProps> = ({ streamManager }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (streamManager && videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
		}
	}, [streamManager]);

	return <video autoPlay={true} ref={videoRef} />;
};
