import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { InstitutionProfileType } from "@/lib/institutionProfile";


export default function Header({
  profile,
}: {
  profile: InstitutionProfileType;
}) {
  return (
    <header className="flex justify-between items-center p-6 bg-base-200 text-base-content shadow">
            <div className="flex items-center gap-4">
      {profile.churchLogoUrl && (
        <img
          src={profile.churchLogoUrl}
          alt="Logo da Igreja"
          className="h-12 rounded"
        />
      )}
        <h1 className="text-xl font-bold">{profile.churchName}</h1>
      </div>
      {/*<ThemeToggle />*/}
    </header>
  );
}
