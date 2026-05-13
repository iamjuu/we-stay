import { redirect } from "next/navigation";

/** Legacy URL: build preference now lives at `/steps/step-5`. */
export default function StepSixRedirect() {
  redirect("/steps/step-5");
}
