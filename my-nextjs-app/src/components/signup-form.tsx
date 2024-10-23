"use client";

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useApi } from '@/utils/api';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm() {
  const { fetchWithAuth } = useApi();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { login } = useAuth()

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(
        "https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.text()
      console.log("Registration successful")
      setSuccessMessage(data)
      
      // Optionally, you can automatically log in the user after successful registration
      // by calling the login function from useAuth
      // login(data) // Uncomment this if you want to auto-login after registration
    } catch (error) {
      console.error("Error:", error)
      setErrorMessage("Registration failed: " + (error as Error).message)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mt-2">{successMessage}</div>
          )}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
