// pages/api/randomBooks.js
export default async function handler(req, res) {
  try {
    const searchTerms = [
      'historia', 'ciencias', 'tecnología', 'arte', 'biografía','filosofía', 'terror',
      'ingeniería', 'matemáticas', 'educación', 'psicología', 'literatura', 'física', 'astronomía', 'biología'
    ];

    let books = [];
    let attempts = 0;
    const maxAttempts = 10;

    while (books.length < 9 && attempts < maxAttempts) {
      const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      const startIndex = Math.floor(Math.random() * 40);
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${term}&startIndex=${startIndex}&maxResults=10`;

      const gbRes = await fetch(apiUrl);
      const gbJson = await gbRes.json();

      if (gbJson.items && gbJson.items.length > 0) {
        const filtered = gbJson.items
          .map(item => ({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || ['Unknown'],
            description: item.volumeInfo.description || 'No description available.',
            imageLink: item.volumeInfo.imageLinks?.thumbnail || '',
          }))
          .filter(book => book.imageLink);

        for (const book of filtered) {
          if (books.length >= 9) break;
          if (!books.find(b => b.title === book.title)) {
            books.push(book);
          }
        }
      }

      attempts++;
    }

    return res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: 'Error fetching random books from Google Books API.' },
    });
  }
}