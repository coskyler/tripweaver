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
      router.push("/trips")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button onClick={handleGoogleSignIn} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
      Sign in with Google
    </button>
  )
}