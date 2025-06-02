// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface Question {
//   question: string;
//   choices: string[];
//   correctIndex: number;
// }

// interface MultipleChoiceQuizProps {
//   moduleId: number;
//   onPassQuiz?: (passed: boolean) => void;
// }

// const questionsByModule: Record<number, Question[]> = {
//   1: [
//     {
//       question: "What condition is indicated by this ECG?",
//       choices: [
//         "Third Degree Block",
//         "Failure to capture",
//         "Bradycardia",
//         "Atrial fibriliation",
//       ],
//       correctIndex: 2,
//     },
//     {
//       question: "You want to evaluate their intrinsic rhythm and adjust pacemaker settings appropriately. What is the correct sequence of steps?",
//       choices: [
//         "Lower the base rate, lower aOutput, then decrease sensitivity until sensing occurs",
//         "Increase the rate, increase aOutput, and maximize sensitivity",
//         "Switch to asynchronous mode, increase output, and monitor for capture",
//         "Disable the pacemaker to assess rhythm, then re-enable it with default settings"
//       ],
//       correctIndex: 0,
//     },
//     {
//       question: "What mode would you put your pacemaker in to start this? You have Atrial leads connected.",
//       choices: ["VOO", "AAI", "VVI", "DDD"],
//       correctIndex: 1,
//     }
//   ],
//   2: [
//     {
//       question: "What does a failure to sense typically indicate?",
//       choices: [
//         "Battery failure",
//         "Loose leads",
//         "High sensing threshold",
//         "Low pacing output",
//       ],
//       correctIndex: 1,
//     },
//     {
//       question: "Adjust some dials on the pacemaker and see what happens",
//       choices: [
//         "ECG corrects itself",
//         "Sensitivity fixes issue",
//         "Pacing output needed to be increased",
//         "Nothing happens",
//       ],
//       correctIndex: 3,
//     },    
//     {
//       question: "How should we proceed to solve the problem?",
//       choices: [
//         "ECG corrects itself",
//         "Sensitivity fixes issue",
//         "Pacing output needed to be increased",
//         "Nothing happens",
//       ],
//       correctIndex: 3,
//     },
//   ],
//   3: [
//     {
//       question: "What does a failure to sense typically indicate?",
//       choices: [
//         "Battery failure",
//         "Loose leads",
//         "High sensing threshold",
//         "Low pacing output",
//       ],
//       correctIndex: 2,
//     },
//   ],
//   // Add more modules and questions here
// };

// const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
//   moduleId,
//   onPassQuiz,
// }) => {
//   const questions = questionsByModule[moduleId] ?? [];
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [showResult, setShowResult] = useState(false);
//   const [correctCount, setCorrectCount] = useState(0);

//   const currentQuestion = questions[currentIndex];

//   const handleChoice = (index: number) => {
//     setSelectedIndex(index);
//     setShowResult(true);
  
//     const isCorrect = index === currentQuestion.correctIndex;
//     if (isCorrect) {
//       console.log("Correct choice selected!");
//       setCorrectCount((prev) => prev + 1);
//     } else {
//       console.log("Incorrect choice selected.");
//     }
  
//     const isLastQuestion = currentIndex === questions.length - 1;
//     if (isLastQuestion) {
//       const finalCorrectCount = correctCount + (isCorrect ? 1 : 0);
//       const passed = finalCorrectCount === questions.length;  
//       onPassQuiz?.(passed); // <-- pass 'passed' value

//     }
//   };
  

// const handleNext = () => {
//   setSelectedIndex(null);
//   setShowResult(false);
//   setCurrentIndex((prev) => prev + 1);
// };


//   if (!currentQuestion) {
//     return <p>No questions for this module.</p>;
//   }

//   return (
//     <Card className="p-6 mb-6">
//       <h3 className="mb-4 text-xl font-semibold">{currentQuestion.question}</h3>
//       <div className="space-y-3">
//         {currentQuestion.choices.map((choice, index) => {
//           const isCorrect = index === currentQuestion.correctIndex;
//           const isSelected = index === selectedIndex;
//           const showFeedback = showResult && isSelected;

//           return (
// <Button
//   key={index}
//   variant={isSelected ? "default" : "outline"}
//   className={`w-full justify-start whitespace-normal text-left min-h-[4rem] py-2 px-4 ${
//     showFeedback
//       ? isCorrect
//         ? "bg-green-200 border-green-500"
//         : "bg-red-200 border-red-500"
//       : ""
//   }`}
//   onClick={() => handleChoice(index)}
//   disabled={showResult}
// >
//   {choice}
// </Button>


//           );
//         })}
//       </div>

//       {showResult && (
//         <div className="mt-4">
//           <p className="mb-2 font-medium">
//             {selectedIndex === currentQuestion.correctIndex
//               ? "✅ Correct!"
//               : `❌ Incorrect. Correct answer: ${currentQuestion.choices[currentQuestion.correctIndex]}`}
//           </p>
//           {currentIndex + 1 < questions.length ? (
//             <Button onClick={handleNext}>Next Question</Button>
//           ) : (

//             <span>Finished! Now, adjust pacemaker</span> // or style it however you want
//           )}
//         </div>
//       )}
//     </Card>
//   );
// };

// export default MultipleChoiceQuiz;


// src/components/multipleChoiceQuiz.tsx - Updated to use Convex
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from '@nanostores/react'
import { $userData } from "@/stores/auth";
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface Question {
  question: string;
  choices: string[];
  correctIndex: number;
}

interface MultipleChoiceQuizProps {
  moduleId: number;
  sessionId?: string;
  onPassQuiz?: (passed: boolean, score: number, maxScore: number) => void;
}

const questionsByModule: Record<number, Question[]> = {
  1: [
    {
      question: "What condition is indicated by this ECG?",
      choices: [
        "Third Degree Block",
        "Failure to capture",
        "Bradycardia",
        "Atrial fibrillation",
      ],
      correctIndex: 2,
    },
    {
      question: "You want to evaluate their intrinsic rhythm and adjust pacemaker settings appropriately. What is the correct sequence of steps?",
      choices: [
        "Lower the base rate, lower aOutput, then decrease sensitivity until sensing occurs",
        "Increase the rate, increase aOutput, and maximize sensitivity",
        "Switch to asynchronous mode, increase output, and monitor for capture",
        "Disable the pacemaker to assess rhythm, then re-enable it with default settings"
      ],
      correctIndex: 0,
    },
    {
      question: "What mode would you put your pacemaker in to start this? You have Atrial leads connected.",
      choices: ["VOO", "AAI", "VVI", "DDD"],
      correctIndex: 1,
    }
  ],
  2: [
    {
      question: "What does a failure to sense typically indicate?",
      choices: [
        "Battery failure",
        "Loose leads",
        "High sensing threshold",
        "Low pacing output",
      ],
      correctIndex: 1,
    },
    {
      question: "How should you adjust the pacemaker when you see oversensing?",
      choices: [
        "Increase sensitivity",
        "Decrease sensitivity", 
        "Increase pacing output",
        "Change pacing mode",
      ],
      correctIndex: 1,
    },    
    {
      question: "What is the most likely cause of this rhythm disturbance?",
      choices: [
        "Lead displacement",
        "Battery depletion",
        "Electromagnetic interference",
        "All of the above",
      ],
      correctIndex: 3,
    },
  ],
  3: [
    {
      question: "What does undersensing typically indicate?",
      choices: [
        "Battery failure",
        "Loose leads", 
        "Low sensing threshold",
        "High pacing output",
      ],
      correctIndex: 2,
    },
    {
      question: "How do you correct undersensing?",
      choices: [
        "Increase sensitivity (lower mV)",
        "Decrease sensitivity (higher mV)",
        "Increase pacing rate",
        "Change pacing mode",
      ],
      correctIndex: 0,
    },
  ],
  4: [
    {
      question: "What indicates successful capture?",
      choices: [
        "Pacing spike present",
        "QRS complex follows each spike",
        "Heart rate matches pacing rate",
        "Both B and C",
      ],
      correctIndex: 3,
    },
    {
      question: "If you don't see capture, what should you do first?",
      choices: [
        "Increase pacing rate",
        "Increase pacing output",
        "Check lead connections",
        "Change pacing mode",
      ],
      correctIndex: 2,
    },
  ],
  5: [
    {
      question: "Failure to capture is characterized by:",
      choices: [
        "No pacing spikes visible",
        "Pacing spikes present but no QRS response", 
        "Irregular heart rhythm",
        "Fast heart rate",
      ],
      correctIndex: 1,
    },
    {
      question: "The most common cause of failure to capture is:",
      choices: [
        "Lead displacement",
        "Battery failure",
        "Inadequate output energy",
        "Electromagnetic interference",
      ],
      correctIndex: 0,
    },
  ],
};

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  moduleId,
  sessionId,
  onPassQuiz,
}) => {
  const userData = useStore($userData);
  const recordQuizAttempt = useMutation(api.quizzes.recordQuizAttempt);
  
  const questions = questionsByModule[moduleId] ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<Array<{
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    questionText: string;
    selectedText: string;
  }>>([]);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];

  const handleChoice = async (index: number) => {
    setSelectedIndex(index);
    setShowResult(true);
  
    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // Record this answer
    const answerRecord = {
      questionIndex: currentIndex,
      selectedAnswer: index,
      correctAnswer: currentQuestion.correctIndex,
      isCorrect,
      questionText: currentQuestion.question,
      selectedText: currentQuestion.choices[index],
    };

    setAnswers(prev => [...prev, answerRecord]);
  
    const isLastQuestion = currentIndex === questions.length - 1;
    if (isLastQuestion) {
      const finalCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const finalAnswers = [...answers, answerRecord];
      const passed = finalCorrectCount === questions.length;
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Save quiz attempt to Convex
      if (userData?.id) {
        try {
          await recordQuizAttempt({
            userId: userData.id as Id<"users">,
            moduleId,
            sessionId: sessionId as Id<"sessions">,
            questions: finalAnswers,
            score: finalCorrectCount,
            maxScore: questions.length,
          });
        } catch (error) {
          console.error('Error saving quiz attempt:', error);
        }
      }

      onPassQuiz?.(passed, finalCorrectCount, questions.length);
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentQuestion) {
    return (
      <Card className="p-6 mb-6">
        <p>No questions available for this module.</p>
      </Card>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Card className="p-6 mb-6">
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Score: {correctCount}/{currentIndex + (showResult ? 1 : 0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h3 className="mb-4 text-xl font-semibold">{currentQuestion.question}</h3>
      
      <div className="space-y-3">
        {currentQuestion.choices.map((choice, index) => {
          const isCorrect = index === currentQuestion.correctIndex;
          const isSelected = index === selectedIndex;
          const showFeedback = showResult && isSelected;

          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className={`w-full justify-start whitespace-normal text-left min-h-[4rem] py-3 px-4 ${
                showFeedback
                  ? isCorrect
                    ? "bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                    : "bg-red-100 border-red-500 text-red-800 hover:bg-red-100"
                  : ""
              }`}
              onClick={() => handleChoice(index)}
              disabled={showResult}
            >
              <div className="flex items-center">
                <span className="flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold border rounded-full">
                  {String.fromCharCode(65 + index)}
                </span>
                {choice}
              </div>
            </Button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <div className="mb-3">
            {selectedIndex === currentQuestion.correctIndex ? (
              <div className="flex items-center text-green-700">
                <span className="mr-2 text-xl">✅</span>
                <span className="font-medium">Correct!</span>
              </div>
            ) : (
              <div className="text-red-700">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-xl">❌</span>
                  <span className="font-medium">Incorrect</span>
                </div>
                <p className="text-sm">
                  Correct answer: <strong>{currentQuestion.choices[currentQuestion.correctIndex]}</strong>
                </p>
              </div>
            )}
          </div>
          
          {currentIndex + 1 < questions.length ? (
            <Button onClick={handleNext} className="mt-2">
              Next Question →
            </Button>
          ) : (
            <div className="mt-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">
                  Quiz Complete! Final Score: {correctCount + (selectedIndex === currentQuestion.correctIndex ? 1 : 0)}/{questions.length}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {correctCount + (selectedIndex === currentQuestion.correctIndex ? 1 : 0) === questions.length 
                    ? "Perfect! You can now proceed with the module."
                    : "You can now proceed with the module, but consider reviewing the material."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default MultipleChoiceQuiz;
