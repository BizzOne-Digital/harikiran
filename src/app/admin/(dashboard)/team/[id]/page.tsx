import { notFound } from "next/navigation";
import { getTeamMember } from "@/actions/team";
import { TeamMemberForm } from "@/components/admin/forms/TeamMemberForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) notFound();
  return <TeamMemberForm id={id} initial={member} />;
}
