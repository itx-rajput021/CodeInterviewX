import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Candidate from './dashboard/Candidate'
import Interviewer from './dashboard/Interviewer'
import InterviewRoom from './dashboard/InterviewRoom'


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Signin />;
  }

  return user.role === "interviewer"
    ? <Interviewer />
    : <Candidate />;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:roomCode" element={<InterviewRoom />} />
      </Routes>
    </Router>
  )
}

export default App
