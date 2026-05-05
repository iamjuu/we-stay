import { redirect } from "next/navigation";

/** Legacy route: guided flow now ends at `/3dpage`, then `/steps/thank-you`. */
export default function StepSevenRedirect() {
  redirect("/3dpage");
}
