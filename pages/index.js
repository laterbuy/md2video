import { useEffect } from "react"
import speak  from "../utils/speak"

export default function Home() {
  useEffect(() => {
    speak({text: '你好， 世界'})
  }, [])
  return (
    <div>
      index
    </div>
  )
}
