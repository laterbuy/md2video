
export default function Voice()  {
  const queryParams = {
    // voiceURI: 'Ting-Ting',
    // lang: 'zh-CN',
    // volume: 1,
    // pitch: 1,
    // rate: 1,
    text: '大扎好，我西渣渣辉。'
  }
  const onSpeak = () => {
    const speechInstance = new SpeechSynthesisUtterance();
    Object.keys(queryParams).forEach(key => {
      speechInstance[key] = queryParams[key];
    })
    console.log(speechInstance);
    typeof speechSynthesis !== "undefined" && speechSynthesis.speak(speechInstance);
    speechInstance.onstart = () => {
      console.log('onstart')
    }
    speechInstance.onend = () => {
      console.log('end')
    }
  }
  return (
    <div>
      <div onClick={onSpeak}>speak</div>
    </div>
  )
}
