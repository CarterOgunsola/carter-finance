"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { PencilIcon, SaveIcon, XIcon } from "lucide-react";

export interface EditModeWrapperProps {
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isModified: boolean;
  lastSaved?: string;
  title: string;
}

export function EditModeWrapper({
  children,
  onSave,
  onCancel,
  isModified,
  lastSaved,
  title,
}: EditModeWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isModified) {
      setShowConfirmDialog(true);
    } else {
      onCancel();
      setIsEditing(false);
    }
  };

  const confirmCancel = () => {
    onCancel();
    setIsEditing(false);
    setShowConfirmDialog(false);
  };

  const formattedLastSaved = lastSaved
    ? format(new Date(lastSaved), "MMM d, yyyy 'at' h:mm a")
    : "Never";

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Last saved: {formattedLastSaved}
          </p>
        </div>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="gap-2"
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="gap-2"
                disabled={!isModified}
              >
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div
        className={`rounded-lg transition-colors ${
          isEditing
            ? "bg-card"
            : "bg-muted/50 pointer-events-none select-none opacity-75"
        }`}
      >
        {children}
      </div>

      {isModified && isEditing && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}