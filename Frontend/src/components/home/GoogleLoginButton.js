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
    <button onClick={handleGoogleSignIn} className=" bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-sm">
      Sign in with Google
    </button>
  )
}