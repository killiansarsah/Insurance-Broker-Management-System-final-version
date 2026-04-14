"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { AlertCard } from "@/components/ui/alert-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AlertCardDemo() {
  const [isCardVisible, setIsCardVisible] = React.useState(true);

  const router = useRouter();
  const handleUnderstood = () => {
    console.log("User understood the alert.");
    setIsCardVisible(false);
    router.push("/dashboard/tasks");
  };
  
  const handleDismiss = () => {
    console.log("User dismissed the alert.");
    setIsCardVisible(false);
  };
  
  // A button to reset the demo and show the card again
  const handleReset = () => {
    setIsCardVisible(true);
  };

  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
      {!isCardVisible && (
         <Button onClick={handleReset}>Show Test Alert Card</Button>
      )}

      <AlertCard
        isVisible={isCardVisible}
        title="Don't miss your flight"
        description="Hi Jonathan, You have a flight today at 02:15 PM. Better to go early to avoid road traffic."
        buttonText="Take Action Now"
        onButtonClick={handleUnderstood}
        onDismiss={handleDismiss} // Provide dismiss handler to show the X button
        icon={<Bell className="h-6 w-6 text-white" />}
      />
    </div>
  );
}
