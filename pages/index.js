import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({ disabled, checked }) {
  const router = useRouter();
  useEffect(() => {
    router.push("/tables");
  });
  return null;
}
