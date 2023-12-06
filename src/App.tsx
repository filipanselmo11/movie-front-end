import { useEffect, useState, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";

interface MoviesProps {
  id: number;
  titulo: string;
  genero: string;
  ano: number;
  created_at: string;
}

export default function App() {
  const [movies, setMovies] = useState<MoviesProps[]>([]);
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState(0);
  // const tituloRef = useRef<HTMLInputElement | null>(null);
  // const generoRef = useRef<HTMLInputElement | null>(null);
  // const anoRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    const response = await api.get("/movies");
    setMovies(response.data);
    // console.log('RESPONSE ', response.data);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!titulo || !genero || !ano) return;
    const response = await api.post("/movie", {
      titulo: titulo,
      genero: genero,
      ano: ano,
    });

    setMovies((allMovies) => [...allMovies, response.data]);

    setTitulo("");
    setGenero("");
    setAno(0);
  }

  async function handleDelete(id: number) {
    try {
      await api.delete("/movie", {
        params: {
          id: id,
        },
      });

      const allMovies = movies.filter((movie) => movie.id !== id);
      setMovies(allMovies);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Filmes</h1>
        <form className="flex flex-col my-6" onSubmit={submit}>
          <label className="font-medium text-white">Titulo</label>
          <input
            className="w-full mb-5 p-2 rounded"
            type="text"
            placeholder="Titulo do Filme"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
          />
          <label className="font-medium text-white">Gênero</label>
          <input
            className="w-full mb-5 p-2 rounded"
            type="text"
            placeholder="Gênero do Filme"
            value={genero}
            onChange={(event) => setGenero(event.target.value)}
          />
          <label className="font-medium text-white">Ano</label>
          <input
            className="w-full mb-5 p-2 rounded"
            type="number"
            placeholder="Ano de lançamento do Filme"
          />
          <input
            type="submit"
            value="Cadastrar Filme"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>
        <section className="flex flex-col gap-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
            >
              <p>
                <span>Título: </span>
                {movie.titulo}
              </p>
              <p>
                <span>Gênero</span>
                {movie.genero}
              </p>
              <p>
                <span>Ano</span>
                {movie.ano}
              </p>
              <button
                onClick={() => handleDelete(movie.id)}
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
              >
                <FiTrash size={18} color="#FFFFFF" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
