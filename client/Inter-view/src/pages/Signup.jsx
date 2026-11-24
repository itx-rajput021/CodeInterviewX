import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {useNavigate} from "react-router-dom"
import { signup } from "../api"
import { Link } from 'react-router-dom';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters long")
    }

    try {
      const { data } = await signup(formData)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate('/dashboard')

    } catch (err) {
  console.log(err.response.data);
  console.log(err.response.status);
  console.log(err.response);

  setError(err.response?.data?.message || "Signup failed");
}

  }

  return (
    <form onSubmit={handleSubmit} >

      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">

        {error && (
    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
      {error}
    </div>
  )}

  {/* Show only if user already exists */}
   {error === "User already exists" && (
     <p className="text-sm text-gray-400 mt-2">
      Already have an account?
      <Link
        to="/signin"
        className="text-blue-400 ml-1 hover:underline"
      >
        Sign In
      </Link>
     </p>
    )}

        <div className="mb-8 text-center">
          <h1 className="text-white text-3xl font-bold flex items-center gap-2">
            <span className="text-blue-500">&lt;/&gt;</span> CodeInterviewX
          </h1>
          <p className="text-gray-400 mt-2">Live technical interview platform</p>
        </div>


        <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-white text-xl font-bold mb-6">Create Account</h2>

          <div className="space-y-4">

            {/* full name */}
            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* email */}
            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* password with show/hide */}
            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* role selection: candidate ya interviewer */}
            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2">I am a...</label>
              <div className="flex items-center gap-6">

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === "candidate"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="accent-blue-500 w-4 h-4"
                  />
                  Candidate
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="interviewer"
                    checked={formData.role === "interviewer"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="accent-blue-500 w-4 h-4"
                  />
                  Interviewer
                </label>

              </div>
              {/*  ke hisaab se aage bari logic lagegi -
                  jaise: interviewer ke liye extra fields (company, experience),
                  candidate ke liye alag dashboard/permissions, etc.
                  Ye sab baad mein backend integration ke time add karenge */}
            </div>

            {/* submit button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>


          <p className="text-gray-500 text-center mt-6 text-sm">
            Already have an account? <Link to="/signin" className="text-blue-400 hover:underline cursor-pointer" >Sign in</Link>
          </p>
        </div>
      </div>
    </form>
  )
}

export default Signup