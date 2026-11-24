import React, { useState, useEffect } from 'react'
import { Calendar, LogOut, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInterviews } from '../api'

const Candidate = () => {
  // current logged-in user ka data yahan store hoga
  // jab tak backend se data nahi aata, ye null/empty rahega
  const [user, setUser] = useState(null)

  // interviews ka data (abhi khali array - baad me backend se fill hoga)
  const [interviews, setInterviews] = useState([])
  const navigate = useNavigate()

 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"))
  if (storedUser) setUser(storedUser)
  getInterviews()
    .then(({ data }) => setInterviews(data.interviews || []))
    .catch(() => setInterviews([]))
 }, [])

  // logout click hone par
  const handleLogout = () => {
    // ---- YAHAN BACKEND LOGOUT API CALL HOGI ----
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">

      {/* top navbar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">

        {/* logo */}
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xl">&lt;/&gt;</span>
          <span className="text-white font-semibold text-lg">CodeInterviewX</span>
        </div>

        {/* user info - sirf tab dikhega jab user login ho */}
        {user ? (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-sm font-medium">
      {user.name.slice(0, 2).toUpperCase()}
    </div>
    <div>
      <p className="text-white text-sm font-medium">{user.name}</p>
      <p className="text-gray-500 text-xs uppercase">{user.role}</p>
    </div>
    <button onClick={handleLogout} className="text-gray-400 hover:text-white">
      <LogOut size={18} />
    </button>
  </div>
) : (
  <div className="flex gap-4">
    <a href="/signin" className="text-blue-400 hover:underline">Sign In</a>
  </div>
)}
      </div>

      {/* heading */}
      <h3 className="text-white text-lg font-medium mb-1">Scheduled Interviews</h3>
      <p className="text-gray-400 text-sm mb-6">View your upcoming interviews.</p>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Interviews</p>
          <p className="text-white text-2xl font-medium mt-1">{interviews.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Upcoming</p>

          <p className="text-white text-2xl font-medium mt-1">{interviews.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Completed</p>

          <p className="text-white text-2xl font-medium mt-1">{interviews.filter((item) => item.status === 'completed').length}</p>
        </div>
      </div>

      {/* interviews list ya empty state */}
      {interviews.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Calendar className="mx-auto text-gray-500" size={28} />
          <p className="text-white text-base mt-3">No interviews scheduled</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Once an interviewer schedules one, it will show up here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {interviews.map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-gray-800 bg-gray-900 rounded-lg p-4">
              <div>
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{new Date(item.scheduledAt).toLocaleString()} · {item.durationMinutes} min</p>
              </div>
              {item.status !== 'cancelled' && (
                <button onClick={() => navigate(`/room/${item.roomCode}`)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
                  <Video size={16} /> Join
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Candidate