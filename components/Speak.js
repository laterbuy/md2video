import { useEffect } from "react";

export default function Voice({text}) {
  const speechInstance = new SpeechSynthesisUtterance();
  useEffect(() => {
    if (text) {
      speechInstance[text] = text;
      speechSynthesis.speak(speechInstance);
    speechInstance.onstart = () => {
      console.log('onstart')
    }
    speechInstance.onend = () => {
      console.log('end')
    }
    }

  }, [text]);
  return (
    <div>
      <div onClick={onSpeak}>speak</div>
    </div>
  )
}
