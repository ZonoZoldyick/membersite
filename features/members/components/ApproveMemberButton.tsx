"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import {
  approveMember,
  type MemberApprovalState,
} from "@/features/members/actions";

const initialState: MemberApprovalState = {
  error: "",
  success: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="sm" type="submit">
      {pending ? "Approving..." : "Approve"}
    </Button>
  );
}

type ApproveMemberButtonProps = {
  profileId: string;
};

export function ApproveMemberButton({
  profileId,
}: ApproveMemberButtonProps) {
  const [state, formAction] = useActionState(approveMember, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input name="profileId" type="hidden" value={profileId} />
      <SubmitButton />
      {state.error ? <p className="text-xs text-rose-600">{state.error}</p> : null}
      {state.success ? <p className="text-xs text-emerald-600">{state.success}</p> : null}
    </form>
  );
}
