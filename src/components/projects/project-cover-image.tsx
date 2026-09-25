"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectCoverImageProps {
  className?: string;
  coverUrl: string;
  priority?: boolean;
  sizes: string;
  title: string;
}

function LoadableProjectCover({
  className = "",
  coverUrl,
  priority = false,
  sizes,
  title,
}: ProjectCoverImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-surface-secondary ${className}`}
    >
      {failed ? (
        <div
          aria-label={`${title} project cover unavailable`}
          className="absolute inset-0 flex flex-col justify-between bg-surface-secondary p-5"
          role="img"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Project cover
            </span>
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          </div>
          <svg aria-hidden="true" className="h-auto w-full" viewBox="0 0 280 110">
            <path
              className="text-border"
              d="M0 20H280M0 55H280M0 90H280"
              fill="none"
              stroke="currentColor"
              strokeDasharray="3 6"
            />
            <path
              className="text-accent-subtle"
              d="M0 88C34 74 55 81 88 62C120 44 148 70 181 48C215 26 244 43 280 24V110H0Z"
              fill="currentColor"
            />
            <path
              className="text-accent"
              d="M0 88C34 74 55 81 88 62C120 44 148 70 181 48C215 26 244 43 280 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
        </div>
      ) : (
        <Image
          alt={`${title} project cover`}
          className="object-cover"
          fill
          onError={() => setFailed(true)}
          priority={priority}
          sizes={sizes}
          src={coverUrl}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60"
      />
    </div>
  );
}

export function ProjectCoverImage(props: ProjectCoverImageProps) {
  return <LoadableProjectCover key={props.coverUrl} {...props} />;
}
