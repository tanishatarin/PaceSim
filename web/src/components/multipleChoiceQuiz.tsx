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
      question: "What condition is indicated by this ECG?",
      choices: [
        "Third Degree Block",
        "Failure to capture",
        "Bradycardia",
        "Atrial fibriliation",
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
      question: "What mode would you put your pacemaker in to start this?",
      choices: ["VOO", "AAI", "VVI", "DDD"],
      correctIndex: 1,
    }
  ],
  3: [
    {
      question: "What does a failure to sense typically indicate?",
      choices: [
        "Battery failure",
        "Loose leads",
        "High sensing threshold",
        "Low pacing output",
      ],
      correctIndex: 2,
    },
  ],
  // Add more modules and questions here
};

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  moduleId,
  onComplete,
}) => {
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
  className={`w-full justify-start whitespace-normal text-left min-h-[4rem] py-2 px-4 ${
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
          {currentIndex + 1 < questions.length ? (
            <Button onClick={handleNext}>Next Question</Button>
          ) : (

            <span>Finished! Now, adjust pacemaker</span> // or style it however you want
          )}
        </div>
      )}
    </Card>
  );
};

export default MultipleChoiceQuiz;
