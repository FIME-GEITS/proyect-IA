// pages/api/generate.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: {
        message: "OpenAI API key not configured, añade OPENAI_API_KEY en .env.local",
      },
    });
  }

  const { next = "", gender = "", author = "" } = req.body;
  if (!next.trim()) {
    return res.status(400).json({
      error: { message: "Por favor ingresa una entrada válida en ‘next’" },
    });
  }

  try {
    // 1) Pido al modelo un JSON
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente de recomendaciones de libros." },
        { role: "user", content: generatePrompt(next, gender, author) },
      ],
      temperature: 0.7,
    });

    let text = chat.choices[0].message.content.trim();

    // 2) Quito backticks si los hubiera
    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?/g, "").replace(/```$/g, "").trim();
    }

    // 3) Parseo el JSON
    const rec = JSON.parse(text);

    // 4) Busco la portada en Google Books
    const query = encodeURIComponent(`intitle:${rec.titulo}+inauthor:${rec.autores[0]}`);
    const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    const gbJson = await gbRes.json();
    const thumb =
      gbJson.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
      rec.imagen_portada ||   // fallback a lo que sugirió el modelo
      "";

    // 5) Devuelvo el JSON final
    res.status(200).json({
      result: {
        titulo: rec.titulo,
        autores: rec.autores,
        descripcion: rec.descripcion,
        imagen_portada: thumb,
      },
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({
      error: { message: error.message || "Error en petición a OpenAI o Google Books" },
    });
  }
}

function generatePrompt(next, gender, author) {
  const cap = s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "";
  return `
Sugiere un libro que cumpla con los siguientes requisitos:
- Género: ${cap(gender)}
- Temática: ${cap(next)}
- Autor similar a: ${cap(author)}

Responde estrictamente en formato JSON con el siguiente esquema:

{
  "titulo": "Nombre del libro",
  "autores": ["Autor1", "Autor2"],
  "descripcion": "Breve descripción del libro",
  "imagen_portada": "URL de una imagen ilustrativa o representativa del libro (Asegurate que la URL exista)"
}

_No agregues nada fuera del JSON._
  `.trim();
}