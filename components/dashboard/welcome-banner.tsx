"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="relative bg-card border-primary/20">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome to The Carter Finance Tool</h2>
            <p className="text-muted-foreground mt-1">
              Your personal finance companion for mindful money management
            </p>
          </div>
          
          <div className="prose prose-sm text-muted-foreground">
            <p>
              This simple yet powerful tool helps you track expenses, monitor savings, 
              and develop a healthier relationship with your finances - all in one place.
            </p>
            
            <p>
              I created this tool for my own financial journey, and I&apos;m sharing it 
              because I believe in making money management more accessible and less overwhelming.
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Privacy Notice</h3>
            <p className="text-sm text-muted-foreground">
              This tool operates entirely in your browser&apos;s local storage. No personal data 
              is collected, tracked, or stored on any servers. No cookies are used. Your financial 
              information remains completely private and secure on your device.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}