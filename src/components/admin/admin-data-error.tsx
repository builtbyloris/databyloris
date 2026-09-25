import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDataError({
  title = "Project data is unavailable",
}: {
  title?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-text-secondary">
          Check the Supabase connection and confirm that the latest database
          migration has been applied and this account exists in the Admin
          allowlist.
        </p>
      </CardContent>
    </Card>
  );
}
