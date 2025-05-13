import React from "react";

interface DatabaseErrorMessageProps {
  title?: string;
  message?: string;
  details?: string;
  showTroubleshooting?: boolean;
}

export function DatabaseErrorMessage({
  title = "Database Connection Error",
  message = "The database server is currently unavailable.",
  details,
  showTroubleshooting = false,
}: DatabaseErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium">{title}</h3>
      <p>{message}</p>
      {details && (
        <p className="text-sm mt-2">
          <strong>Error details:</strong> {details}
        </p>
      )}

      {showTroubleshooting && (
        <div className="mt-4 bg-background/80 p-3 rounded text-sm">
          <p className="font-medium mb-2">Troubleshooting steps:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Check if the database server is running</li>
            <li>Verify database connection in .env file</li>
            <li>Restart the application server</li>
            <li>Contact support if the issue persists</li>
          </ol>
        </div>
      )}
    </div>
  );
}
