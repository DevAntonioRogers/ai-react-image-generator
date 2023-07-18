import { useEffect, useState, useRef, FormEvent } from "react";
import { Configuration, OpenAIApi } from "openai";

const App = () => {
  const [placeholder, setPlaceholder] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const phrases = [
    "A Pineapple in the ocean",
    "Astronaut on the moon with a beer",
    "A dog walking a cat",
    "Superman on the train",
  ];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBeforeTyping = 1000;

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;

    function type() {
      const currentPhrase = phrases[currentIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, currentText.length - 1);
      } else {
        currentText = currentPhrase.substring(0, currentText.length + 1);
      }

      setPlaceholder(currentText);

      if (!isDeleting && currentText === currentPhrase) {
        isDeleting = true;
        typingTimerRef.current = setTimeout(type, delayBeforeTyping);
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % phrases.length;
        typingTimerRef.current = setTimeout(type, typingSpeed);
      } else {
        typingTimerRef.current = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
      }
    }

    typingTimerRef.current = setTimeout(type, delayBeforeTyping);

    return () => {
      const timer = typingTimerRef.current;
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, []);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
  });

  configuration.baseOptions.headers = {
    Authorization: "Bearer " + import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
  };
  const openai = new OpenAIApi(configuration);

  const generateImage = async (e: FormEvent) => {
    e.preventDefault();
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);

    try {
      const res = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
      });

      setLoading(false);
      setResult(res.data.data[0].url!);
      console.log(result);
    } catch (error) {
      setLoading(false);
      if (typeof error === "string") {
        console.error(`Error generating image: ${error}`);
      } else if (error instanceof Error) {
        console.error(`Error generating image: ${error.message}`);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <h1 className="text-5xl font-bold uppercase bg-gradient-to-r from-pink-500 via-yellow-300 to-green-300 text-transparent bg-clip-text">
        Ai Image Generator
      </h1>
      <span className="text-white font-semibold">Creat images using Artificial Intelligence. Try it now!</span>

      <form className="mt-20 flex">
        <input
          className="w-80 rounded-md px-1"
          type="text"
          placeholder={placeholder}
          onChange={(e) => setPrompt(e.target.value as string)}
        />
        <button onClick={generateImage}>
          <span className="bg-gradient-to-r from-pink-500 via-yellow-300 to-green-300 text-white py-1 px-3 bg-clip-text text-transparent text-2xl cursor-pointer">
            Create ✨
          </span>
        </button>
      </form>

      {loading ? (
        <div className=" text-5xl font-bold uppercase bg-gradient-to-r from-pink-500 via-yellow-300 to-green-300 text-transparent bg-clip-text mt-10">
          Loading...
        </div>
      ) : (
        <></>
      )}

      {result.length > 0 ? <img className="mt-10" src={result} alt="Generated Image" /> : <></>}
    </div>
  );
};

export default App;
