import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Or wherever your icons come from
import { Button } from "@/components/ui/button"; // Adjust if needed

export default function TestModal() {
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleBack = () => {
    alert("Returning to Menu!");
    setShowCompletion(false);
  };

  const startSession = (id: string, title: string) => {
    alert(`Starting session for ${title} (id: ${id})`);
  };

  const moduleInfo = {
    id: "123",
    title: "Test Module"
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Button onClick={() => { setIsSuccess(true); setShowCompletion(true); }}>Test Success Modal</Button>
      <Button variant="outline" onClick={() => { setIsSuccess(false); setShowCompletion(true); }}>Test Failure Modal</Button>

      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg text-center relative">
            <div className="flex flex-col items-center justify-center py-6">
              {isSuccess ? (
                <>
                  <CheckCircle aria-label="Success Icon" className="w-24 h-24 mb-6 text-green-500" />
                  <h2 className="mb-4 text-3xl font-bold">Module Completed!</h2>
                  <p className="mb-8 text-lg">Great job! You've successfully completed this module.</p>
                </>
              ) : (
                <>
                  <XCircle aria-label="Failure Icon" className="w-24 h-24 mb-6 text-red-500" />
                  <h2 className="mb-4 text-3xl font-bold">Module Incomplete</h2>
                  <p className="mb-8 text-lg">Don't worry! You can try this module again.</p>
                </>
              )}
              <div className="flex space-x-4 mt-8">
                <Button type="button" variant="outline" className="px-6" onClick={handleBack}>
                  Return to Menu
                </Button>
                <Button
                  type="button"
                  className="px-6"
                  onClick={() => {
                    setShowCompletion(false);
                    startSession(moduleInfo.id, moduleInfo.title);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
