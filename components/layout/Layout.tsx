import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="principal-container" style={{ paddingTop: "100px" }}>
        {children}
      </main>
    </>
  );
}
