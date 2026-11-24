import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInterviews, createInterview, updateInterview, cancelInterview } from "../api";
import {
  LogOut,
  Plus,
  Video,
  Clock,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";

const Interviewer = () => {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', candidateName: '', scheduledAt: '', durationMinutes: 60, language: 'javascript', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) setUser(storedUser);
    getInterviews()
      .then(({ data }) => setInterviews(data.interviews || []))
      .catch(() => setInterviews([]));
  }, []);

  const scheduleInterview = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createInterview({ ...form, interviewerName: user?.name });
      setInterviews((items) => [data.interview, ...items]);
      setShowForm(false);
      setForm({ title: '', candidateName: '', scheduledAt: '', durationMinutes: 60, language: 'javascript', description: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to schedule interview');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white">

      {/* Main Container */}
      <div className="max-w-[1700px] mx-auto px-10 py-8">

        {/* ================= NAVBAR ================= */}

        <nav className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-8 py-5 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-3xl font-bold">
              {"</>"}
            </span>

            <div>
              <h1 className="text-3xl font-bold tracking-wide">
                CodeInterviewX
              </h1>

              <p className="text-gray-400 text-sm">
                Interviewer Dashboard
              </p>
            </div>
          </div>

          {/* User */}

          {user && (
            <div className=" flex items-center gap-4 ">

              <div className="hidden  w-14 h-14 rounded-full bg-blue-600 lg:flex items-center justify-center text-lg font-bold uppercase ">
                {user.name.slice(0, 2)}
              </div>

              <div className="sm:flex hidden flex-col">
                <p className="text-lg font-semibold ">
                  {user.name}
                </p>

                <p className="uppercase text-gray-400 text-sm">
                  {user.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="ml-3 p-3 rounded-xl hover:bg-gray-800 transition"
              >
                <LogOut size={22} />
              </button>
            </div>
          )}
        </nav>

        {/* ================= HEADER ================= */}

        <div className="mt-10 flex items-center justify-between">

          <div>

            <h2 className="text-5xl font-bold">
              Your Interviews
            </h2>

            <p className="text-gray-400 mt-3 text-lg">
              Manage interviews, candidates and schedule new sessions.
            </p>

          </div>

          <button onClick={() => setShowForm(true)} className="flex items-center gap-3  bg-blue-600 hover:bg-blue-700 lg:px-8 lg:py-4 sm:px-4 sm:py-2 rounded-xl lg:text-lg sm:text-sm  lg:font-semibold sm:font-medium transition">

            <Plus size={22} />

            Schedule Interview

          </button>

        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form onSubmit={scheduleInterview} className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Schedule Interview</h2><button type="button" onClick={() => setShowForm(false)} className="text-gray-400">✕</button></div>
              <div className="grid gap-4">
                <input required placeholder="Interview title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none" />
                <input required placeholder="Candidate name" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none" />
                <input required type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" min="15" max="240" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none" />
                  <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="cpp">C++</option></select>
                </div>
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-24 resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none" />
                <button className="rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700">Create Interview</button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-10">

          {/* Card 1 */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Total Interviews
                </p>

                <h1 className="text-6xl font-bold mt-5">
                  {interviews.length}
                </h1>

              </div>

              <Calendar
                size={42}
                className="text-blue-500"
              />

            </div>

          </div>

          {/* Card 2 */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-200">
                  Scheduled
                </p>

                <h1 className="text-6xl font-bold mt-5">
                  {interviews.filter((item) => item.status === 'scheduled').length}
                </h1>

              </div>

              <Clock
                size={42}
                className="text-green-500"
              />

            </div>

          </div>

          {/* Card 3 */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Candidates
                </p>

                <h1 className="text-6xl font-bold mt-5">
                  {new Set(interviews.map((item) => item.candidateName)).size}
                </h1>

              </div>

              <Users
                size={42}
                className="text-yellow-500"
              />

            </div>

          </div>

          {/* Card 4 */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Completed
                </p>

                <h1 className="text-6xl font-bold mt-5">
                  {interviews.filter((item) => item.status === 'completed').length}
                </h1>

              </div>

              <Briefcase
                size={42}
                className="text-purple-500"
              />

            </div>

          </div>

        </div>
                  {/* Empty State (jab koi interview schedule na ho) */}

          {interviews.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 py-24 px-8 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 border border-blue-600/20">
                <Video size={34} className="text-blue-500" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                No Interviews Yet
              </h2>

              <p className="mt-3 text-gray-400 max-w-lg mx-auto leading-7">
                You haven't scheduled any interviews yet.
                Click the button below to create your first technical interview.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-8 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20"
              >
                Schedule Your First Interview
              </button>

            </div>
          )}

          {/* Interview Cards */}

          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mt-6 hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

                <div>

                  <h2 className="text-xl font-semibold text-white">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-5 mt-4 text-gray-400">

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(item.scheduledAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="rounded-full border border-gray-700 px-3 py-1 text-xs uppercase">{item.status}</span>

                  </div>

                </div>

                <div className="flex gap-3">

                  {item.status !== 'cancelled' && (
                    <button
                      onClick={async () => {
                        await updateInterview(item.id, { status: 'live' });
                        navigate(`/room/${item.roomCode}`);
                      }}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all"
                    >
                      Join Room
                    </button>
                  )}
                  {item.status !== 'cancelled' && (
                    <button
                      onClick={async () => {
                        await cancelInterview(item.id);
                        setInterviews((items) => items.map((row) => row.id === item.id ? { ...row, status: 'cancelled' } : row));
                      }}
                      className="px-5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 transition-all"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>
            </div>
          ))}

      </div>

    </div>
  )
}

export default Interviewer