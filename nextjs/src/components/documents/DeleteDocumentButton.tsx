"use client";

import React, { useState } from "react";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DeleteDocumentButtonProps {
  documentId: string;
  documentTitle: string;
  documentFileCount?: number;
  documentSize?: string;
  onDeleted?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const DeleteDocumentButton: React.FC<DeleteDocumentButtonProps> = ({
  documentId,
  documentTitle,
  documentFileCount = 0,
  documentSize = "Unknown",
  onDeleted,
  className = "",
  children = "Delete Document",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { trackCustomEvent } = useAnalytics();

  return (
    <>
      <button
        onClick={() => {
          trackCustomEvent("document_delete_attempt", "document", documentId);
          setIsOpen(true);
        }}
        className={`text-red-600 hover:text-red-800 ${className}`}
      >
        {children}
      </button>

      <DeleteDocumentDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        documentId={documentId}
        documentTitle={documentTitle}
        documentFileCount={documentFileCount}
        documentSize={documentSize}
        onDeleted={() => {
          setIsOpen(false);
          onDeleted?.();
        }}
      />
    </>
  );
};
