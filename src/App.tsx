import { useEffect, useState, useRef } from "react";

const App = () => {
  const [placeholder, setPlaceholder] = useState("");
  const phrases = [
    "A Pineapple in the ocean",
    "Astronaut on the moon with a beer",
    "A dog walking a cat",
    "Superman on the train",
  ];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBeforeTyping = 1000;

  const typingTimerRef = useRef(null);

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
      clearTimeout(typingTimerRef.current);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center flex-col">
      <h1 className="text-5xl font-bold uppercase bg-gradient-to-r from-pink-500 via-yellow-300 to-green-300 text-transparent bg-clip-text">
        Ai Image Generator
      </h1>
      <span className="text-white font-semibold">Creat images using Artificial Intelligence. Try it now!</span>

      <form className="mt-20 flex">
        <input className="w-80 rounded-md px-1" type="text" placeholder={placeholder} />
        <button>
          <span className="bg-gradient-to-r from-pink-500 via-yellow-300 to-green-300 text-white py-1 px-3 bg-clip-text text-transparent text-2xl cursor-pointer">
            Create ✨
          </span>
        </button>
      </form>
    </div>
  );
};

export default App;
