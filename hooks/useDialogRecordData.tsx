import { createContext, ReactNode, useContext, useState } from "react";

export interface RecordData {
  "@odata.etag"?: string;
  Id: number;
}

type ContextValue<T extends RecordData> = [
  recordData: T,
  setRecordData: React.Dispatch<React.SetStateAction<T>>
];

// Crear el contexto
const DialogRecordDataContext = createContext<ContextValue<any> | null>(null);

// Crear el proveedor
function DialogRecordDataProvider<T extends RecordData>({
  children,
  initialRecordData,
}: {
  children: ReactNode;
  initialRecordData: T;
}) {
  const [recordData, setRecordData] = useState<T>(initialRecordData);

  return (
    <DialogRecordDataContext.Provider value={[recordData, setRecordData]}>
      {children}
    </DialogRecordDataContext.Provider>
  );
}

function useDialogRecordDataContext<T extends RecordData>() {
  const context = useContext(DialogRecordDataContext) as ContextValue<T>;

  if (!context) {
    throw new Error(
      "useDialogRecordDataContext must be used within a DialogRecordDataProvider"
    );
  }

  return context;
}

export { DialogRecordDataProvider, useDialogRecordDataContext };
