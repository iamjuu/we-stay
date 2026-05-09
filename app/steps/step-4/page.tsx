import { redirect } from "next/navigation";

export default function StepFourRedirect() {
  redirect("/steps/step-5");
}
