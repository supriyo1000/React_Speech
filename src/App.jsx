import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState } from "react";

const interviewQuestions = [
  "Tell me about yourself.",
  "Why do you want to work for our company?",
  "What are your strengths and weaknesses?",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
];

export default function App() {
  const [textToCopy, setTextToCopy] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-600 text-center mt-10">Your browser doesn't support speech recognition.</p>;
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const speakText = (text) => {
    console.log("Speaking:", text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.8; // slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const askNextQuestion = () => {
    stopListening();
    resetTranscript();
    const nextIndex = (questionIndex + 1) % interviewQuestions.length;
    setQuestionIndex(nextIndex);
    speakText(interviewQuestions[nextIndex]);
    setTimeout(() => startListening(), 3000);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">🎤 English Speaking Practice</h1>
        <p className="text-center text-gray-500">Simulate job interview questions and practice your spoken English</p>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">🗨️ Current Question:</p>
          <p className="text-lg font-semibold text-gray-800">{interviewQuestions[questionIndex]}</p>
        </div>

        <div
          className="bg-white border border-gray-300 p-4 min-h-[100px] rounded-lg text-gray-700 cursor-pointer"
          onClick={() => setTextToCopy(transcript)}
        >
          {transcript || "🎙️ Your spoken answer will appear here..."}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <button onClick={startListening} className="btn">Start Listening</button>
          <button onClick={stopListening} className="btn-outline">Stop</button>
          <button onClick={() => speakText(transcript)} className="btn">Repeat My Answer</button>
          <button onClick={askNextQuestion} className="btn">Next Question</button>
          <button onClick={() => navigator.clipboard.writeText(textToCopy)} className="btn-outline">Copy</button>
          <button onClick={() => navigator.clipboard.readText().then(setTextToCopy)} className="btn-outline">Paste</button>
          <button onClick={() => setTextToCopy("")} className="btn-danger col-span-2 sm:col-span-1">Clear</button>
        </div>
      </div>

      {/* Tailwind button styles */}
      <style>{`
        .btn {
          @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
        }
        .btn-outline {
          @apply px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition;
        }
      `}</style>
    </div>
  );
}
