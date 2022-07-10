import { useEffect, useState, useRef } from "react";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Script from 'next/script'

const ffmpeg = createFFmpeg({
  corePath: '/ffmpeg-core.js',
  log: true,
});

export default function Audio() {
  const [isStart, setIsStart] = useState(false);
  const [src, setSrc] = useState('');

  const audioRef = useRef(null);
  const recoder = useRef(null);

  useEffect(() => {
  }, []);

  const onClick = async () => {
    setIsStart(!isStart);

    if (isStart) {
      recoder.current.stopRecording(() => {
        audioRef.current.srcObject = null;
        const blob = recoder.current.getBlob();
        setSrc(URL.createObjectURL(blob));
        recoder.current.microphone.stop();
      });
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((microphone) => {


        import("recordrtc").then(({ default: RecordRTC, ...rest }) => {
          console.log(rest)
          audioRef.current.srcObject = microphone;
          recoder.current = RecordRTC(microphone, {
            type: 'audio',
            desiredSampRate: 16000
          });

          recoder.current.startRecording();

          // release microphone on stopRecording
          recoder.current.microphone = microphone;
        })


      }).catch(function (error) {
        alert('Unable to access your microphone.');
        console.error(error);
      });
    }

  }

  return (
    <div>
      <Script src="/coi-serviceworker.js" />
      <div style={{ display: 'flex' }}>
        <audio ref={audioRef} src={src} controls autoPlay playsInline />
      </div>

      <button onClick={onClick}>{isStart ? '暂停' : '开始'}</button>
    </div>
  )
}
