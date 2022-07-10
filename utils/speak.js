/*
 * @Author: houbb
 * @Date: 2022-07-09 16:30:15
 * @LastEditTime: 2022-07-10 09:36:42
 * @LastEditors: houbb
 * @Description:
 */

export default ({text, startCb, endCb}) => {
  const speechInstance = new SpeechSynthesisUtterance();
  if (text) {
    speechInstance['text'] = text;
    speechInstance['lang'] = 'zh-CN';
    speechSynthesis.speak(speechInstance);
    speechInstance.onstart = () => {
      console.log('onstart');
      if (startCb) {
        startCb()
      }
    }
    speechInstance.onend = () => {
      console.log('end')
      if (endCb) {
        endCb()
      }
    }
  }
}
