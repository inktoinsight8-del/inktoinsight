"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, Loader2, KeyRound, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"login" | "forgot" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Forgot password inputs
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Status states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password.")
        setLoading(false)
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send reset code.")
      } else {
        setSuccess("A 6-digit verification code has been sent to your Gmail.")
        setStep("reset")
      }
    } catch (err: any) {
      console.error(err)
      setError("Failed to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError("Please enter a valid 6-digit numeric verification code.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password: newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to reset password.")
      } else {
        setSuccess("Password updated successfully! You can now log in.")
        setStep("login")
        // Clear forms
        setPassword("")
        setCode("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      console.error(err)
      setError("Failed to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8F9FB] px-4 overflow-hidden select-none font-sans">
      
      {/* Animated Finance & Insights Background */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) scale(0.8); opacity: 0; }
          20% { opacity: 0.15; }
          80% { opacity: 0.15; }
          100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
        }
        @keyframes chart-grow {
          0%, 100% { transform: scaleY(0.4); opacity: 0.05; }
          50% { transform: scaleY(1); opacity: 0.15; }
        }
        .finance-grid {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(79, 109, 245, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(79, 109, 245, 0.05) 1px, transparent 1px);
        }
      `}</style>

      {/* Grid Pattern */}
      <div className="absolute inset-0 finance-grid pointer-events-none" />

      {/* Animated Growing Chart Bars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div
            key={`bar-${i}`}
            className="absolute bottom-0 w-12 lg:w-16 bg-gradient-to-t from-[#4F6DF5]/0 to-[#4F6DF5] rounded-t-sm origin-bottom"
            style={{
              left: `${4 + i * 7}%`,
              height: `${25 + (i * 23) % 45}%`,
              animation: `chart-grow ${6 + (i % 4)}s infinite ease-in-out ${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Floating Data Nodes & Trendlines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute w-2.5 h-2.5 rounded-full border-2 border-[#4F6DF5] bg-white shadow-[0_0_10px_rgba(79,109,245,0.4)]"
            style={{
              left: `${8 + (i * 31) % 85}%`,
              animation: `float-up ${14 + (i % 8)}s infinite linear ${i * 1.5}s`
            }}
          >
            {/* Connecting upward trend line */}
            <div className="absolute top-1/2 left-full w-24 md:w-40 h-[1.5px] bg-gradient-to-r from-[#4F6DF5]/40 to-transparent -translate-y-1/2 rotate-[-25deg] origin-left" />
          </div>
        ))}
      </div>

      {/* Soft overlay gradients to blend top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FB] via-transparent to-[#F8F9FB] pointer-events-none" />
      
      {/* Dynamic Main Portal Card */}
      <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[2rem] p-8 shadow-2xl shadow-indigo-900/5 relative z-10 transition-all duration-300">
        
        {/* Logo / Title block */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-purple-500/10 flex items-center justify-center mb-5 border border-gray-50 p-1 relative overflow-hidden">
             <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
          </div>
          <h1 className="font-serif italic text-3xl font-black tracking-tight text-[#1A1A2E] mb-1.5">
            inktoinsight
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#4F6DF5] mb-2">
            Administrator Workspace
          </p>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#4F6DF5]/30 to-transparent mx-auto rounded-full" />
        </div>

        {/* Global Feedback Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-100 text-center animate-fadeIn shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 text-center animate-fadeIn shadow-sm">
            {success}
          </div>
        )}

        {/* STEP 1: Standard Login Form */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Admin Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Secret Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setSuccess(null)
                      setStep("forgot")
                    }}
                    className="text-[11px] font-bold text-[#4F6DF5] hover:text-[#3B3FA0] focus:outline-none transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#4F6DF5] to-[#3B3FA0] hover:shadow-lg hover:shadow-[#4F6DF5]/25 focus:outline-none disabled:opacity-50 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Request Reset Code (Forgot Password) */}
        {step === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                  Request Password Reset
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your email address and we will mail you a secure 6-digit OTP code.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Account Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setStep("login")
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#4F6DF5] to-[#3B3FA0] hover:shadow-lg hover:shadow-[#4F6DF5]/25 disabled:opacity-50 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send OTP Code <KeyRound className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Verify OTP & Change Password */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Enter Verification Details
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A verification code has been dispatched. Enter it below to authorize a new password.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  6-Digit OTP Code
                </label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-lg text-center font-black tracking-[0.5em] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4F6DF5] transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F6DF5] focus:ring-4 focus:ring-[#4F6DF5]/10 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setStep("forgot")
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#4F6DF5] to-[#3B3FA0] hover:shadow-lg hover:shadow-[#4F6DF5]/25 disabled:opacity-50 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
