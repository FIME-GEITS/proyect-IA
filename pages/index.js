import Head from "next/head";
import { useState } from "react";
import BookInputComponent from "./components/BookInputComponent";
import styles from "./index.module.css";

export default function Home() {
  const [nextBook, setNextBook] = useState('');
  const [genderBook, setGenderBook] = useState('');
  const [authorBook, setAuthorBook] = useState('');
  const [result, setResult] = useState();
  const handleInputNext = (e) => {
    setNextBook(e.target.value);
  };
  const handleInputGender = (e) => {
    setGenderBook(e.target.value);
  };
  const handleInputAuthor = (e) => {
    setAuthorBook(e.target.value);
  };

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          next: nextBook,
          gender: genderBook,
          author: authorBook}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      console.log(`1 ${nextBook} 2 ${genderBook} 3 ${authorBook}`);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>BIB-IA</title>
        <link rel="icon" href="beardread.png" />
      </Head>

      <main className={styles.main}>
        <img src="beardread.png" className={styles.icon} />
        <h3>BIB-IA</h3>
        <form onSubmit={onSubmit}>
        <BookInputComponent 
        placeholder="Menciona que te gustaría que tratara tu proximo libro"
        value={nextBook}
        onChange={handleInputNext}/>
        <BookInputComponent placeholder="Ingresa el género que mas te guste leer"
        value={genderBook}
        onChange={handleInputGender}/>
        <BookInputComponent placeholder="Ingresa alguno de tus autores favoritos"
        value={authorBook}
        onChange={handleInputAuthor}/>
          <input type="submit" value="Genera mi proximo libro a leer" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
