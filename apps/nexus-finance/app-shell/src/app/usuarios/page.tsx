import { PagePlaceholder, UsersIcon } from "@nexus/ui";

export default function UsuariosPage() {
  return (
    <PagePlaceholder
      title="Usuarios"
      description="Gestión global de usuarios de Nexus Finance (nivel app). Los roles se asignan por módulo."
      icon={<UsersIcon />}
    />
  );
}