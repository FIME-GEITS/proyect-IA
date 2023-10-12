import Head from "next/head";
import { useState } from "react";
import BookInputComponent from "./components/BookInputComponent";
import styles from "./index.module.css";
import 'animate.css';
import { render } from "react-dom";

export default function Home() {
  const [nextBook, setNextBook] = useState('');
  const [genderBook, setGenderBook] = useState('');
  const [authorBook, setAuthorBook] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [beforecomp, setBeforeComp] = useState(true);
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
  const handleClick = (e) => {
    e.preventDefault();
    setButtonClicked(true)
    setBeforeComp(false)
  }

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
        <span className="animate__animated animate__fadeInDown">
        <img src="beardread.png" className={styles.icon} />
        <h1 className={styles.title}>BIB-IA</h1>
        </span>
        <form onSubmit={onSubmit}>
        {buttonClicked!=true ?  
        <div className={styles.box}><BookInputComponent 
        placeholder="Menciona de que te gustaría que tratara tu proximo libro"
        value={nextBook}
        onChange={handleInputNext}/>
         {nextBook != "" ? <a onClick={handleClick}><img className={styles.bnext} src="next.png" /></a> : null}
        </div>: null}

        {buttonClicked ? 
        <div className={styles.box}>
        <BookInputComponent placeholder="Ingresa el género que mas te guste leer"
        value={genderBook}
        onChange={handleInputGender}/>
        <img className={styles.bnext} src="next.png" /></div> : null}
        <div></div>
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
