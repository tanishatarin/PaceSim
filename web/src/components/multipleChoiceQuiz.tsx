import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  question: string;
  choices: string[];
  correctIndex: number;
}

interface MultipleChoiceQuizProps {
  moduleId: number;
  onComplete?: (passed: boolean) => void;
}

const questionsByModule: Record<number, Question[]> = {
  1: [
    {
      question: "What is the purpose of the initial pacemaker setting?",
      choices: ["To increase heart rate", "To monitor ECG", "To reset the device", "To initiate battery test"],
      correctIndex: 1,
    },
  ],
  2: [
    {
      question: "What does a failure to sense typically indicate?",
      choices: ["Battery failure", "Loose leads", "High sensing threshold", "Low pacing output"],
      correctIndex: 2,
    },
  ],
  // Add more modules and questions here
};

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ moduleId, onComplete }) => {
  const questions = questionsByModule[moduleId] ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleChoice = (index: number) => {
    setSelectedIndex(index);
    setShowResult(true);
    if (index === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setShowResult(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete?.(correctCount === questions.length);
    }
  };

  if (!currentQuestion) {
    return <p>No questions for this module.</p>;
  }

  return (
    <Card className="p-6 mb-6">
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
              className={`w-full justify-start ${
                showFeedback
                  ? isCorrect
                    ? "bg-green-200 border-green-500"
                    : "bg-red-200 border-red-500"
                  : ""
              }`}
              onClick={() => handleChoice(index)}
              disabled={showResult}
            >
              {choice}
            </Button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4">
          <p className="mb-2 font-medium">
            {selectedIndex === currentQuestion.correctIndex
              ? "✅ Correct!"
              : `❌ Incorrect. Correct answer: ${currentQuestion.choices[currentQuestion.correctIndex]}`}
          </p>
          <Button onClick={handleNext}>
            {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MultipleChoiceQuiz;
