import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";

// Define the type for the book object
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

export function ExploreView() {
  const { token } = useAuth();
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]); // Specify the type for recommendedBooks

  useEffect(() => {
    handleRecommendations();
  }, []);

  const handleRecommendations = async () => {
    if (!token) return;

    try {
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/shelves/getRecommendation', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendedBooks(data.items || []); // Set recommended books
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center">Recommended Books from</h1>
      <div className="book-grid">
        {recommendedBooks.map((book) => (
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
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
