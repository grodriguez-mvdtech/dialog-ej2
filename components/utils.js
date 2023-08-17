import dynamic from "next/dynamic";

export function getDynamicComponent({ componentKey, props }) {
  const DynamicComponent = dynamic(
    () => import(`../components/${componentKey}`),
    {
      ssr: false,
      loading: () => <p>Cargando...</p>,
    }
  );
  return <DynamicComponent {...props} />;
}

export function removeInvalidCharacters(string) {
  return string.replace(/[^a-z0-9-_:]|^[^a-z]+/gi, "");
}
