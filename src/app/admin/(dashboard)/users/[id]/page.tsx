import { notFound } from "next/navigation";
import { getUser } from "@/actions/users";
import { UserForm } from "@/components/admin/forms/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();
  return (
    <UserForm
      id={id}
      initial={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
