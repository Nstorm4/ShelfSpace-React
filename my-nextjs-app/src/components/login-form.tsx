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

export function LoginForm() {
  const { fetchWithAuth } = useApi();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const { login } = useAuth()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(
        "https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/user/logIn",
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
        throw new Error("Login failed")
      }

      const token = await response.text()
      if (token) {
        console.log("Login successful")
        console.log("Generated token:", token) // Log the token to the console
        localStorage.setItem("username", username) 
        login(token)
      } else {
        setErrorMessage("Login failed")
      }
    } catch (error) {
      console.error("Error:", error)
      setErrorMessage("Login failed: " + (error as Error).message)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
