import { redirect } from "next/navigation";

import { SPOTIFY_PROJECT_PATH } from "@/lib/projects/project-identifiers";

export default function DemoPage() {
  redirect(SPOTIFY_PROJECT_PATH);
}
