"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useState } from 'react'
import { useApi } from '@/utils/api';
import { ToggleLeft, ToggleRight, Book, User } from 'lucide-react'; // Import Lucide icons

// Aktualisierter Typ für die Buchobjekte
type Book = {
  title: string;
  author: string;
  coverUrl: string;
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
  const { fetchWithAuth } = useApi();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Book[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const { token } = useAuth();
  const [shelves, setShelves] = React.useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'title' | 'author'>('title'); // New state for search mode

  React.useEffect(() => {
    fetchShelves()
  }, [token])

  const fetchShelves = async () => {
    if (!token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelf', {
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
    if (searchMode === 'title') {
      // Call the original title search
      await handleSearchTitle();
    } else {
      // Call the author search
      await handleSearchAuthor();
    }
  };

  const handleSearchTitle = async () => {
    const response = await fetch(`https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book/searchByTitle?title=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    // Map the data to the expected Book format
    if (Array.isArray(data)) {
        const formattedResults = data.map((item: any) => ({
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
        }));
        setResults(formattedResults);
    } else {
        console.error('Unexpected data format:', data);
        setResults([]); // Clear results if the format is unexpected
    }
    setShowResults(true);
  };

  const handleSearchAuthor = async () => {
    const response = await fetch(`https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book/searchByAuthor?author=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    // Map the data to the expected Book format
    if (Array.isArray(data)) {
        const formattedResults = data.map((item: any) => ({
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
        }));
        setResults(formattedResults);
    } else {
        console.error('Unexpected data format:', data);
        setResults([]); // Clear results if the format is unexpected
    }
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false)
    setResults([])
  }

  const addToShelf = async (book: Book, shelfName: string) => {
    if (!token) return;

    const bookData = {
      shelfName,
      book: {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl
      }
    };

    console.log("Request details:", {
      url: 'https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book', {
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
      <div className="flex gap-2 mb-4">
        <button
          className={`sort-button ${searchMode === 'title' ? 'active' : ''}`} // Style for active state
          onClick={() => setSearchMode('title')}
          style={{ color: searchMode === 'title' ? 'red' : 'inherit', fontSize: '0.875rem' }} // Highlight selected button and smaller font size
        >
          <Book className="mr-3" /> Title
        </button>
        <button
          className={`sort-button ${searchMode === 'author' ? 'active' : ''}`} // Style for active state
          onClick={() => setSearchMode('author')}
          style={{ color: searchMode === 'author' ? 'red' : 'inherit', fontSize: '0.875rem' }} // Highlight selected button and smaller font size
        >
          <User className="mr-3" /> Author
        </button>
      </div>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search by ${searchMode === 'title' ? 'title...' : 'author...'}`}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {showResults && results.length > 0 && ( // Ensure results exist before rendering
        <div>
          <Button onClick={handleBack} className="mb-4 mt-2">Back</Button>
          <div className="book-grid">
            {results.map((book: Book) => (
              <Card key={book.title} className="book-item">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="book-item-content">
                  <div className="book-item-title">{book.title}</div>
                  <div className="book-item-author">
                    {book.author}
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
