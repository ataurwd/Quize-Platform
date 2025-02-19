import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// -----------------------
// IndexedDB Helper Functions
// -----------------------
function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("QuizDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("quizHistory")) {
        db.createObjectStore("quizHistory", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = () => {
      reject("Error opening IndexedDB");
    };
  });
}

async function saveHisory(history) {
  try {
    const db = await openDB();
    const transaction = db.transaction("quizHistory", "readwrite");
    const store = transaction.objectStore("quizHistory");
    store.add(history);
    transaction.oncomplete = () => {
      // console.log("Quiz history saved successfully.");
      Swal.fire({
        title: "Quiz history saved successfully",
        icon: "success",
        draggable: true,
      });
    };
    transaction.onerror = (error) => {
      console.error("Error saving quiz history: ", error);
    };
  } catch (error) {
    console.error("Error in saveHisory:", error);
  }
}

// -----------------------
// Quiz Data & Component
// -----------------------
const quizData = [
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: "Mercury",
  },
  {
    question:
      "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue",
  },
  {
    question:
      "Which of the following is primarily used for structuring web pages?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: "HTML",
  },
  {
    question: "Which chemical symbol stands for Gold?",
    options: ["Au", "Gd", "Ag", "Pt"],
    correctAnswer: "Au",
  },
  {
    question:
      "Which of these processes is not typically involved in refining petroleum?",
    options: [
      "Fractional distillation",
      "Cracking",
      "Polymerization",
      "Filtration",
    ],
    correctAnswer: "Filtration",
  },
  { question: "What is the value of 12 + 28?", correctAnswer: "40" },
  {
    question: "How many states are there in the United States?",
    correctAnswer: "50",
  },
  {
    question: "In which year was the Declaration of Independence signed?",
    correctAnswer: "1776",
  },
  {
    question: "What is the value of pi rounded to the nearest integer?",
    correctAnswer: "3",
  },
  {
    question:
      "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    correctAnswer: "120",
  },
];

const QuizPlatform = () => {
  // State declarations
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");

  // Timer effect: counts down while the question isn’t answered correctly.
  useEffect(() => {
    if (!quizFinished && !answeredCorrectly) {
      if (timer > 0) {
        const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        return () => clearTimeout(countdown);
      } else {
        // If time runs out without any attempt, record a "No Answer" attempt.
        if (currentAttempt === 0) {
          const attemptRecord = {
            question: quizData[currentQuestion].question,
            selectedAnswer: "No Answer",
            isCorrect: false,
            attemptNumber: 1,
            questionIndex: currentQuestion,
          };
          setAttempts((prev) => [...prev, attemptRecord]);
        }
        handleNextQuestion();
      }
    }
  }, [timer, quizFinished, answeredCorrectly, currentAttempt, currentQuestion]);

  // Save quiz history in IndexedDB when quiz finishes.
  useEffect(() => {
    if (quizFinished) {
      const history = {
        timestamp: new Date().toISOString(),
        score,
        totalQuestions: quizData.length,
        attempts,
      };
      saveHisory(history);
    }
  }, [quizFinished, score, attempts]);

  // Answer selection handler for both multiple-choice and free-text answers.
  const handleAnswerSelection = (answer) => {
    if (answeredCorrectly) return; 
    setCurrentAttempt((prev) => prev + 1);
    const correctAnswer = quizData[currentQuestion].correctAnswer
      .toString()
      .trim()
      .toLowerCase();
    const givenAnswer = answer.toString().trim().toLowerCase();
    const isCorrect = givenAnswer === correctAnswer;

    const attemptRecord = {
      question: quizData[currentQuestion].question,
      selectedAnswer: answer,
      isCorrect,
      attemptNumber: currentAttempt + 1,
      questionIndex: currentQuestion,
    };
    setAttempts((prev) => [...prev, attemptRecord]);

    if (isCorrect) {
      setFeedback("Correct!");
      setAnsweredCorrectly(true);
      setScore((prev) => prev + 1);
    } else {
      setFeedback("Incorrect, try again!");
    }
  };

  // Moves to the next question or ends the quiz.
  const handleNextQuestion = () => {
    setCurrentAttempt(0);
    setFeedback("");
    setAnsweredCorrectly(false);
    setTimer(30);
    setTextAnswer("");

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Restart the quiz.
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAttempts([]);
    setTimer(30);
    setQuizFinished(false);
    setFeedback("");
    setAnsweredCorrectly(false);
    setCurrentAttempt(0);
    setTextAnswer("");
  };

  return (
    <div className="p-6 mx-auto bg-white">
      {!quizFinished ? (
        <div key={currentQuestion} className="p-6 mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold text-black mb-4">
            {quizData[currentQuestion].question}
          </h2>

          {quizData[currentQuestion].options ? (
            <ul className="space-y-2">
              {quizData[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    answeredCorrectly
                      ? "bg-gray-200 cursor-default opacity-70"
                      : "bg-white hover:bg-blue-100"
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="my-4">
              <input
                type="text"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={answeredCorrectly}
                placeholder="Type your answer here..."
              />
              <button
                className="mt-3 cursor-pointer w-full py-2 px-4 bg-green-500 text-white rounded-lg disabled:bg-gray-400"
                onClick={() => {
                  if (textAnswer.trim() !== "") {
                    handleAnswerSelection(textAnswer);
                    setTextAnswer("");
                  }
                }}
                disabled={answeredCorrectly || textAnswer.trim() === ""}
              >
                Submit Answer
              </button>
            </div>
          )}

          <p className="mt-2 text-green-600 font-medium">Time left: {timer}s</p>
          <p className="mt-2 text-red-500 font-medium">{feedback}</p>

          <div className="mt-4 flex gap-3">
            {answeredCorrectly ? (
              <button
                className="w-full cursor-pointer py-2 px-4 bg-green-500 text-white rounded-lg"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            ) : (
              <button
                className="w-full cursor-pointer py-2 px-4 bg-gray-400 text-white rounded-lg"
                onClick={handleNextQuestion}
              >
                Skip
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h2 className="text-3xl font-bold text-purple-700 text-center">
            Quiz Completed
          </h2>
          <p className="mt-3 text-xl text-blue-600 text-center">
            Your score:{" "}
            <span className="font-semibold">
              {score} / {quizData.length}
            </span>
          </p>

          <h3 className="mt-6 text-xl font-semibold text-gray-800">
            Attempt History
          </h3>
          <div className="mt-3 overflow-auto border rounded-lg">
            <table className="w-full border-collapse border shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-400 text-white">
                  <th className="border px-6 py-3 text-left">Question</th>
                  <th className="border px-6 py-3">Attempt #</th>
                  <th className="border px-6 py-3">Selected Answer</th>
                  <th className="border px-6 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.map((attempt, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 text-sm even:bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <td className="border px-6 py-3 text-left">
                      {attempt.question}
                    </td>
                    <td className="border px-6 py-3 text-center">
                      {attempt.attemptNumber}
                    </td>
                    <td className="border px-6 py-3 text-center">
                      {attempt.selectedAnswer}
                    </td>
                    <td className="border px-6 py-3 text-center font-semibold">
                      {attempt.isCorrect ? (
                        <span className="text-green-600">✔ Correct</span>
                      ) : (
                        <span className="text-red-500">✖ Incorrect</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-6 w-full cursor-pointer py-3 bg-red-500 text-white font-semibold rounded-lg"
            onClick={restartQuiz}
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlatform;
