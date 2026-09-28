import type {ReactNode} from "react";
import {Badge, Card, Container, Section} from "@/components/ui";

interface RoutePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  children?: ReactNode;
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  note,
  children,
}: RoutePlaceholderProps) {
  return (
    <Section className="min-h-[68vh]">
      <Container>
        <div className="max-w-3xl">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>
        </div>
        {children ?? (
          <Card className="mt-12 p-8 sm:p-10">
            <div className="data-grid relative min-h-56 overflow-hidden rounded-card border border-border bg-surface-raised">
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <p className="max-w-md text-sm leading-6 text-muted">{note}</p>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </Section>
  );
}
