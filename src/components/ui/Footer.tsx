import React from "react";
import { InstitutionProfileType } from "@/lib/institutionProfile";

export default function Footer({
  profile,
}: {
  profile: InstitutionProfileType;
}) {
  return (
    <footer className="mt-auto p-6 bg-gray-50 dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400">
      {profile.churchName && <div>{profile.churchName}</div>}
      {profile.churchAddress && <div>{profile.churchAddress}</div>}
      {profile.churchPhone && <div>Contato: {profile.churchPhone}</div>}
      <div className="mt-2">© {new Date().getFullYear()}</div>
    </footer>
  );
}
