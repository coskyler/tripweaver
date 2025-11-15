"use client"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "../../lib/firebase"

export default function GoogleLoginButton() {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/tours")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button onClick={handleGoogleSignIn} className="cursor-pointer backdrop-blur-sm border border-white/50 mx-auto w-56 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-lg block">
      Sign in with Google
    </button>
  )
}