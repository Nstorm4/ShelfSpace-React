"use client";

import { useState, useEffect } from "react"
import { SidebarLeft } from "@/components/sidebar-left"
// import { SidebarRight } from "@/components/sidebar-right"
import SearchView from "@/components/views/SearchView"
import CurrentShelfView from "@/components/views/CurrentShelfView"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import FeatureCard from "@/components/feature-card"
import { Search, Library, BookOpen, Users, Settings, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [currentView, setCurrentView] = useState("home")
  const [currentShelf, setCurrentShelf] = useState<string | null>(null)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const renderContent = () => {
    if (currentShelf) {
      return <CurrentShelfView shelf={currentShelf} />;
    }
    switch (currentView) {
      case "home":
        return (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Welcome, {username}
            </h1>
            <p className="text-xl mb-8 text-center text-foreground-muted">
              Your personal library, reimagined.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <FeatureCard
                icon={<Search className="w-8 h-8 text-primary" />}
                title="Discover Books"
                description="Search millions of books using our integrated Google Books API."
              />
              <FeatureCard
                icon={<Library className="w-8 h-8 text-primary" />}
                title="Organize Shelves"
                description="Create custom shelves to categorize and manage your book collection."
              />
              <FeatureCard
                icon={<BookOpen className="w-8 h-8 text-primary" />}
                title="Track Reading"
                description="Use the calendar to track your reading progress."
              />
              <FeatureCard
                icon={<Github className="w-8 h-8 text-primary" />}
                title="Visit our GitHub"
                description="https://github.com/Nstorm4/ShelfSpace/"
              />
            </div>
            
            <div className="bg-background-dark rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Use the search feature to find books you love</li>
                <li>Create custom shelves to organize your collection</li>
                <li>Calendar feature coming soon!</li>
              </ol>
            </div>
          </div>
        );
      case "search":
        return <SearchView />;
      case "trash":
        return <h2>Trash</h2>;
      case "settings":
        return <h2>Settings</h2>;
      default:
        return null;
    }
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <SidebarLeft setCurrentView={setCurrentView} setCurrentShelf={setCurrentShelf} />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
