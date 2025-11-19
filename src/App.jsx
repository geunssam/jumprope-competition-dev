import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>JumpRope Master v20</h1>
        <p>초등학교 줄넘기 연습 및 대회 관리 시스템</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Phase 1: 프로젝트 초기화 완료
        </p>
      </div>
      <p className="read-the-docs">
        Vite + React 19 프로젝트가 성공적으로 생성되었습니다!
      </p>
    </>
  )
}

export default App
