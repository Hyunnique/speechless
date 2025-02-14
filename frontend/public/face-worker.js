// public/face-worker.js
importScripts('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js');

let modelUrl = '/models';
let modelsLoaded = false;

const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
    
    modelsLoaded = true;
  } catch (error) {
    console.error('Failed to load face-api models:', error);
    throw error;
  }
};

const analyzeFace = async (imageData) => {
  if (!modelsLoaded) {
    await loadModels();
  }

  try {
    const canvas = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext('2d');
    
    ctx.putImageData(imageData, 0, 0);

    const detections = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      return { score: null, emotion: null };
    }

    const detection = detections[0];
    const happyScore = Math.floor(detection.expressions.happy * 50);

    let negativeScore = 0;
    negativeScore += detection.expressions.sad;
    negativeScore += detection.expressions.angry;
    negativeScore += detection.expressions.fearful;
    negativeScore += detection.expressions.disgusted;
    negativeScore += detection.expressions.surprised;
    negativeScore = Math.floor(negativeScore * 50);

    const score = 50 + happyScore - negativeScore;
    const emotion = detection.expressions.asSortedArray()[0];

    return { score, emotion };
  } catch (error) {
    console.error('Face analysis error:', error);
    return { score: null, emotion: null };
  }
};

self.onmessage = async function(event) {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'LOAD_MODELS':
        if (data?.modelUrl) {
          modelUrl = data.modelUrl;
        }
        await loadModels();
        self.postMessage({ type: 'MODELS_LOADED' });
        break;

      case 'ANALYZE_FACE':
        if (!data?.imageData) {
          throw new Error('ImageData is required for face analysis');
        }
        const result = await analyzeFace(data.imageData);
        self.postMessage({ type: 'ANALYSIS_RESULT', result });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: error.message || 'Unknown error' 
    });
  }
};