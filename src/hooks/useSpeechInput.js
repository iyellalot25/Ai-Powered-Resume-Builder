// A custom hook that wraps the Web Speech API
// Usage: const { isListening, startListening } = useSpeechInput(onResult)

import { useState, useRef } from "react";

function useSpeechInput(onResult) {
  const [isListening, setIsListening] = useState(false);

  // useRef to store the recognition instance
  // We use ref here (not state) because changing it shouldn't rerender the component
  const recognitionRef = useRef(null);

  function startListening() {
    // Check if browser supports Speech Recognition
    // webkit prefix is needed for Chrome
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser doesn't support voice input. Please use Chrome or Edge.",
      );
      return;
    }

    // If already listening stop
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Create a new recognition instance
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US"; // language to recognize
    recognition.interimResults = false; // only return final results
    recognition.maxAlternatives = 1; // only give us the top result

    // Called when speech is successfully recognized
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript); // pass the text back to the component
    };

    // Called when recognition ends (naturally or via stop())
    recognition.onend = () => {
      setIsListening(false);
    };

    // Called if something goes wrong
    recognition.onerror = (event) => {
      // "nospeech" is common user didn't say anything
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }

  return { isListening, startListening };
}

export default useSpeechInput;
