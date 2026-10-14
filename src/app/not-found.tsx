import Link from "next/link";

import { Card, CardBody } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <CardBody>
        <h1 className="page-title">Page not found</h1>
        <p className="page-description">That ACRU page does not exist or you no longer have access to it.</p>
        <Link className="text-link" href="/dashboard">
          Return to dashboard
        </Link>
      </CardBody>
    </Card>
  );
}
