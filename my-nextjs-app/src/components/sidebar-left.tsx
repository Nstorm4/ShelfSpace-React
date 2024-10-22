"use client"

import * as React from "react"
import {
  Home,
  Search,
  Moon,
  Sun,
  Command,
  Library,
  Plus,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar"

// Define a type for the shelf items
type ShelfItem = {
  name: string;
  onClick: () => void;
  url: string;
  emoji: string;
};

// This is sample data.
const data = {
  teams: [
    {
      name: "ShelfSpace",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      onClick: () => {},
      url: "#",
      icon: Home,
    },
    {
      title: "Search",
      onClick: () => {},
      url: "#",
      icon: Search,
    },
  ],
  navSecondary: [
  ],
  favorites: [
  ],
}

export function SidebarLeft({
  setCurrentView,
  setCurrentShelf,
  ...props
}: React.ComponentProps<typeof Sidebar> & { setCurrentView: (view: string) => void, setCurrentShelf: (shelf: string | null) => void }) {
  const [favorites, setFavorites] = useState<ShelfItem[]>([]);
  const [newShelfName, setNewShelfName] = useState("");
  const { token } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddShelf, setShowAddShelf] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchShelves();
  }, [token]);

  const fetchShelves = async () => {
    if (!token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/userShelves', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const shelves = await response.json();
        setFavorites(shelves.map((shelf: any) => ({
          name: shelf.name,
          onClick: () => setCurrentShelf(shelf.name),
          url: "#",
          emoji: "",
        })));
      }
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };

  const addShelf = async () => {
    if (newShelfName.trim() === "" || !token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/newShelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newShelfName })
      });

      if (response.ok) {
        const result = await response.json();
        const newShelf = {
          name: result.shelfName,
          onClick: () => setCurrentShelf(result.shelfName),
          url: "#",
          emoji: "📚",
        };
        setFavorites([...favorites, newShelf]);
        setNewShelfName("");
      }
    } catch (error) {
      console.error('Error adding shelf:', error);
    }
  };

  const deleteShelf = async (name: string) => {
    if (!token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/deleteShelf', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        setFavorites(favorites.filter((shelf) => shelf.name !== name));
        setCurrentShelf(null);
      }
    } catch (error) {
      console.error('Error deleting shelf:', error);
    }
  };

  const toggleAddShelf = () => {
    setShowAddShelf(!showAddShelf);
    if (showAddShelf) {
      setNewShelfName(""); // Clear input when hiding
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addShelf();
    }
  };

  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} setCurrentView={setCurrentView} setCurrentShelf={setCurrentShelf} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={favorites} onDelete={deleteShelf} />
        {isExpanded && (
          <>
            {showAddShelf ? (
              <div className="add-shelf-container">
                <Library className="add-shelf-icon" size={16} />
                <Input
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="New shelf name"
                  className="add-shelf-input"
                />
                <Button onClick={toggleAddShelf} className="cancel-button">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={toggleAddShelf}
                className="add-shelf-button"
                variant="ghost"
                size="sm"
              >
                <Plus size={16} />
                <span>Add Shelf</span>
              </Button>
            )}
          </>
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="mt-2 w-full"
        >
          {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
