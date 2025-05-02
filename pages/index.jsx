import Head from 'next/head'
import { useState, useEffect } from 'react'
import BookInputComponent from './components/BookInputComponent'
import styles from './index.module.css'
import 'animate.css'

export default function Home() {
  const [nextBook, setNextBook] = useState('')
  const [genderBook, setGenderBook] = useState('')
  const [authorBook, setAuthorBook] = useState('')
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)
  const [randomBooks, setRandomBooks] = useState([])

  useEffect(() => {
    const fetchRandomBooks = async () => {
      try {
        const res = await fetch('/api/randomBooks');
        const data = await res.json();
        if (res.status === 200) {
          setRandomBooks(data.books);
        } else {
          console.error('Failed to fetch random books');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRandomBooks();
  }, []);

  const handleNext = () => {
    if (step === 1 && !nextBook) return
    if (step === 2 && !genderBook) return
    setStep(step + 1)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ next: nextBook, gender: genderBook, author: authorBook }),
      })
      const data = await res.json()
      if (res.status !== 200) {
        throw data.error || new Error(`Status ${res.status}`)
      }
      setResult(data.result)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div>
      <Head>
        <title>FIMEBooks</title>
        <link rel="icon" href="/beardread.png" />   
      </Head>

      <main className={styles.main}>
        <span className="animate__animated animate__fadeInDown animate__slow">
          <img src="/beardread.png" className={styles.icon} alt="Logo FIMEBooks" />
          <h1 className={styles.title}>FIMEBooks</h1>
        </span>

        <form onSubmit={onSubmit} className={styles.form}>
          {step === 1 && (
            <div className={styles.box}>
              <BookInputComponent
                placeholder="Menciona de qué te gustaría que tratara tu próximo libro"
                value={nextBook}
                onChange={e => setNextBook(e.target.value)}
              />
              <button
                type="button"
                onClick={handleNext}
                disabled={!nextBook}
                className={styles.nextBtn}
              >
                <img src="/next.png" alt="Siguiente" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.box}>
              <BookInputComponent
                placeholder="Ingresa el género que más te guste leer"
                value={genderBook}
                onChange={e => setGenderBook(e.target.value)}
              />
              <button
                type="button"
                onClick={handleNext}
                disabled={!genderBook}
                className={styles.nextBtn}
              >
                <img src="/next.png" alt="Siguiente" />
              </button>
            </div>
          )}

          {step === 3 && (
            <>
              <BookInputComponent
                placeholder="Ingresa alguno de tus autores favoritos"
                value={authorBook}
                onChange={e => setAuthorBook(e.target.value)}
              />
              <div className={styles.submitWrapper}>
                <input
                  type="submit"
                  value="Genera mi próximo libro a leer"
                  className={styles.submitBtn}
                />
              </div>
            </>
          )}
        </form>

{!result && (
  <>
    <h2>Descubre tu próxima aventura literaria</h2>
    <div className={styles.slider}>
      <div 
        className={styles.slideTrack}
        style={{ '--total-slides': randomBooks.length * 2 }} // 2 copias
      >
        {randomBooks.length > 0 ? (
          [...randomBooks, ...randomBooks].map((book, index) => (
            <div key={`${index}-${book.title}`} className={styles.slide}>
              <img
                src={book.imageLink}
                alt={`Portada de ${book.title}`}
                className={styles.cover}
              />
            </div>
          ))
        ) : (
          <p>Cargando libros aleatorios...</p>
        )}
      </div>
    </div>
  </>
)}
        {result && typeof result === 'object' && (
          <div className={styles.card}>
            <h2>{result.titulo}</h2>
            <p>
              <strong>Autor{result.autores.length > 1 ? 'es' : ''}:</strong> {result.autores.join(', ')}
            </p>
            <p>{result.descripcion}</p>
            <img
              src={result.imagen_portada}
              alt={`Portada de ${result.titulo}`}
              className={styles.cover}
            />
          </div>
        )}
      </main>
    </div>
  )
}
