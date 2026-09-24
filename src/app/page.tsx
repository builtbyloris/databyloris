import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DesignSystemPreview() {
  return (
    <div className="container-page page-frame">
      <div className="section-separation flex items-start justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <Badge variant="accent">Temporary development preview</Badge>
          <div className="space-y-3">
            <p className="text-overline">databyloris design system</p>
            <h1>Clear stories. Deeper exploration.</h1>
            <p className="text-lead max-w-2xl">
              This internal preview validates typography, semantic color tokens,
              reusable primitives, and the light and dark themes. It is not the
              product Home page.
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <section
        aria-labelledby="typography-title"
        className="section-separation space-y-5"
      >
        <p className="text-overline">Typography</p>
        <h2 id="typography-title">Designed for analytical clarity</h2>
        <p className="max-w-2xl text-text-secondary">
          Editorial surfaces can breathe, while future dashboard surfaces can use
          a wider, denser canvas without changing the visual hierarchy.
        </p>
        <p className="text-sm text-text-muted">
          Muted text supports metadata, annotations, and secondary context.
        </p>
      </section>

      <section aria-labelledby="components-title" className="space-y-6">
        <div className="space-y-2">
          <p className="text-overline">Core primitives</p>
          <h2 id="components-title">Reusable foundations</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card surface="elevated">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Accessible actions with consistent sizing, focus, and state styling.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Compact semantic labels that never depend on color alone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Neutral</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2" surface="secondary">
            <CardHeader>
              <CardTitle>Surface hierarchy</CardTitle>
              <CardDescription>
                Page, primary, secondary, and elevated surfaces retain their roles
                across both themes.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="success">Theme ready</Badge>
              <span className="text-sm text-text-muted">
                Use the toggle above to compare modes.
              </span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
