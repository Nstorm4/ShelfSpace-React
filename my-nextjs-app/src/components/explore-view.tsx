import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";

// Define the type for the book object
type Book = {
  title: string;
  author: string;
  coverUrl: string;
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
      const response = await fetch('https://shelfspacebackend-happy-gecko-kb.apps.01.cf.eu01.stackit.cloud/api/book/recommendation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Log the response status and body
      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data); // Log the data

      if (response.ok) {
        // Directly use the data array
        if (Array.isArray(data)) {
          const formattedBooks = data.map((item: any) => ({
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
          }));
          setRecommendedBooks(formattedBooks); // Set recommended books
        } else {
          console.error('Expected data to be an array:', data);
          setRecommendedBooks([]); // Clear results if the format is unexpected
        }
      } else {
        console.error('Error fetching recommendations:', data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Recommended Books:</h1>
      <div className="book-grid">
        {recommendedBooks.map((book: Book) => (
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
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
