import Image from "next/image";
import type { ReactNode } from "react";

export function PublicSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white">
      <div className="flex min-h-screen">
        <div className="flex w-full flex-row">
          <div className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-10">
            {children}
          </div>
          <div className="hidden flex-col justify-between bg-slate-200 lg:flex lg:max-w-sm xl:max-w-lg">
            <Image
              src="/assets/CLASSWOOD Login Cover.png"
              alt="Classwood"
              width={640}
              height={1024}
              className="h-full w-full object-cover opacity-80"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
