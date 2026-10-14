"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <CardBody>
        <h1 className="page-title">Something went wrong</h1>
        <p className="page-description">The request could not be completed. Try again or contact support.</p>
        <div className="error-action">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
