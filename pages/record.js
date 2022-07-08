import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Script from 'next/script'

const ffmpeg = createFFmpeg({
  corePath: '/ffmpeg-core.js',
  log: true,
});

export default function Record() {
  const [isStart, setIsStart] = useState(false);
  const [randomNum, setRandomNum] = useState(0);
  const [src, setSrc] = useState('');

  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const context = useRef(null);
  const recoder = useRef(null);
  useEffect(() => {
    setInterval(() => {
      setRandomNum(Date.now());
    }, 500);

    context.current = canvasRef.current.getContext('2d');
    context.current.width = elementRef.clientWidth;
    context.current.height = elementRef.clientHeight;
    window.html2canvas = html2canvas;
    // FIX: https://github.com/vercel/next.js/discussions/15965
    import("recordrtc").then(({ default: RecordRTC }) => {
      recoder.current = new RecordRTC(canvasRef.current, {
        type: 'canvas',
      });
    })
  }, []);

  useEffect(() => {
    if (isStart) {
      looper()
    }
  }, [isStart]);


  const looper = () => {
    html2canvas(elementRef.current).then(function (canvas) {
      context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.current.drawImage(canvas, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (!isStart) {
        return;
      }

      requestAnimationFrame(looper);
    });
  }

  const transcode = async (file) => {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'name', await fetchFile(file));
    await ffmpeg.run('-i', 'name', 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    setSrc(URL.createObjectURL(new Blob([data], {type : 'video/mp4'})));

  }

  const onClick = async () => {
    setIsStart(!isStart);

    if (isStart) {
      recoder.current.stopRecording(function () {
        const blob = recoder.current.getBlob();
        // setSrc(URL.createObjectURL(blob));
        transcode(recoder.current.getBlob(blob));
      });
    } else {
      recoder.current.startRecording();
    }

  }

  return (
    <div>
      <Script src="/coi-serviceworker.js" />
      <div style={{ display: 'flex' }}>
        <div ref={elementRef} style={{ border: '1px solid #ccc', width: 200, height: 200 }} >
          {randomNum}
        </div>
        {src && <video controls autoPlay playsInline style={{ height: 200 }} src={src} />}
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', top: -99999999, left: -999999999, }}></canvas>

      <button onClick={onClick}>{isStart ? '暂停' : '开始'}</button>
    </div>
  )
}
