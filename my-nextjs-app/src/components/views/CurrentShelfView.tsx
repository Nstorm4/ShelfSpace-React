import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, SortAsc } from 'lucide-react';
import { useApi } from '@/utils/api';


type Book = {
  title: string;
  author: string;
  coverUrl: string;
};

type Shelf = {
  name: string;
  books: Book[];
};

export default function CurrentShelfView({ shelf }: { shelf: string }) {
  const { fetchWithAuth } = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, [shelf, token]);

  const fetchBooks = async () => {
    if (!token || !shelf) return;

    try {
      const response = await fetch(`https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const shelves: Shelf[] = await response.json();
        const currentShelf = shelves.find(s => s.name === shelf);
        if (currentShelf && currentShelf.books) {
          setBooks(currentShelf.books);
        } else {
          setBooks([]);
        }
      } else {
        console.error('Failed to fetch shelves:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const removeBookFromShelf = async (book: Book) => {
    if (!token || !shelf) return;

    try {
      const response = await fetch(`https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          shelfName: shelf,
          book: {
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setBooks(books.filter(b => b.title !== book.title));
        alert(result.message);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error removing book from shelf");
      }
    } catch (error) {
      console.error('Error removing book from shelf:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const sortBooksByTitle = () => {
    const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));
    setBooks(sortedBooks);
  };

  const sortBooksByAuthor = () => {
    const sortedBooks = [...books].sort((a, b) => a.author.localeCompare(b.author));
    setBooks(sortedBooks);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{shelf}</h2>
        <div className="flex gap-2">
          <Button onClick={sortBooksByTitle} className="sort-button">
            <SortAsc size={14} />
            Sort by Title
          </Button>
          <Button onClick={sortBooksByAuthor} className="sort-button">
            <SortAsc size={14} />
            Sort by Author
          </Button>
        </div>
      </div>
      {books.length === 0 ? (
        <p>Start adding books to your shelf!</p>
      ) : (
        <div className="book-grid">
          {books.map((book, index) => (
            <Card key={index} className="book-item">
              <img 
                src={book.coverUrl} 
                alt={`Cover of ${book.title}`} 
              />
              <div className="book-item-content">
                <h3 className="book-item-title">{book.title}</h3>
                <p className="book-item-author">{book.author}</p>
                <Button 
                  onClick={() => removeBookFromShelf(book)}
                  className="remove-button"
                >
                  <Trash2 size={14} />
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
