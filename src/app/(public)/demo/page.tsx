import { redirect } from "next/navigation";

import { SPOTIFY_DEMO_PROJECT } from "@/data/projects";

export default function DemoPage() {
  redirect(SPOTIFY_DEMO_PROJECT.href);
}
