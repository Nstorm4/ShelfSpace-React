"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useState } from 'react'

// Aktualisierter Typ für die Buchobjekte
type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
};

type AddToShelfDropdownProps = {
  book: Book;
  shelves: string[];
  addToShelf: (book: Book, shelfName: string) => void;
};

const AddToShelfDropdown: React.FC<AddToShelfDropdownProps> = ({ book, shelves, addToShelf }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState('');

  const handleAddToShelf = (shelfName: string) => {
    addToShelf(book, shelfName);
    setSelectedShelf(shelfName);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isOpen ? 'z-20' : ''}`}> {/* Add z-index when open */}
      <button
        className="add-to-shelf-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedShelf ? `✅ ${selectedShelf}` : 'Add to Shelf'}
      </button>
      {isOpen && (
        <div className="add-to-shelf-dropdown">
          {shelves.map((shelf) => (
            <div
              key={shelf}
              className={`shelf-option ${selectedShelf === shelf ? 'selected' : ''}`}
              onClick={() => handleAddToShelf(shelf)}
            >
              {shelf}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function SearchView() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Book[]>([])
  const [showResults, setShowResults] = React.useState(false)
  const { token } = useAuth()
  const [shelves, setShelves] = React.useState<string[]>([])

  React.useEffect(() => {
    fetchShelves()
  }, [token])

  const fetchShelves = async () => {
    if (!token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/userShelves', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const shelvesData = await response.json();
        setShelves(shelvesData.map((shelf: any) => shelf.name));
      }
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };

  const handleSearch = async () => {
    const response = await fetch(`https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/books?title=${encodeURIComponent(query)}`)
    const data = await response.json()
    setResults(data.items || [])
    setShowResults(true)
  }

  const handleBack = () => {
    setShowResults(false)
    setResults([])
  }

  const addToShelf = async (book: Book, shelfName: string) => {
    if (!token) return;

    const bookData = {
      shelfName,
      book: {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
        coverUrl: book.volumeInfo.imageLinks?.thumbnail || ""
      }
    };

    console.log("Request details:", {
      url: 'https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/addBook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error adding book to shelf. Status: ${response.status}, Error: ${errorText}`);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error('Error adding book to shelf:', error);
    }
  };

  return (
    <div className="p-4">
      {!showResults ? (
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      ) : (
        <div>
          <Button onClick={handleBack} className="mb-4">Back</Button>
          <div className="book-grid">
            {results
              .filter((book: Book) => book.volumeInfo.imageLinks?.thumbnail)
              .map((book: Book) => (
                <Card key={book.id} className="book-item">
                  <img 
                    src={book.volumeInfo.imageLinks?.thumbnail} 
                    alt={book.volumeInfo.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="book-item-content">
                    <div className="book-item-title">{book.volumeInfo.title}</div>
                    <div className="book-item-author">
                      {book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Author: Unknown"}
                    </div>
                    <AddToShelfDropdown book={book} shelves={shelves} addToShelf={addToShelf} />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
