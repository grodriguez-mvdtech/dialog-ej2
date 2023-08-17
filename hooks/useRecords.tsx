import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

export interface RecordData {
  "@odata.etag": string;
  Id: number;
}

export interface DataServiceSettings {
  tableName: string;
  query?: string;
}

export interface DataService<T extends RecordData> {
  getRecords(): Promise<T[]>;
  addRecord(record: Omit<T, "@odata.etag" | "Id">): Promise<T>;
  editRecord(record: T): Promise<T>;
  deleteRecord(record: T): Promise<void>;
}

type State<T extends RecordData> = {
  loading: boolean;
  error: string | null;
  records: T[];
};

type Action<T extends RecordData> =
  | { type: "add"; record: T }
  | { type: "edit"; record: T }
  | { type: "delete"; record: T }
  | { type: "get"; records: T[] }
  | { type: "loading"; isLoading: boolean }
  | { type: "error"; message: string };

type ContextValue<T extends RecordData> = {
  loading: boolean;
  error: string | null;
  records: T[];
  getRecords(): Promise<T[]>;
  addRecord(record: Omit<T, "@odata.etag" | "Id">): Promise<T>;
  editRecord(record: T): Promise<T>;
  deleteRecord(record: T): Promise<void>;
};

function reducer<T extends RecordData>(
  state: State<T>,
  action: Action<T>
): State<T> {
  switch (action.type) {
    case "add":
      return { ...state, records: [...state.records, action.record] };
    case "edit":
      return {
        ...state,
        records: state.records.map((r) =>
          r.Id === action.record.Id ? action.record : r
        ),
      };
    case "delete":
      return {
        ...state,
        records: state.records.filter((r) => r.Id !== action.record.Id),
      };
    case "get":
      return { ...state, records: action.records };
    case "loading":
      return { ...state, loading: action.isLoading };
    case "error":
      return { ...state, error: action.message, loading: false };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

const RecordsContext = createContext<ContextValue<any> | null>(null);

function RecordsProvider<T extends RecordData>({
  children,
  dataService, // Agrega el servicio de persistencia como prop
}: {
  children: ReactNode;
  dataService: DataService<T>;
}) {
  const initialState: State<T> = {
    loading: false,
    error: null,
    records: [],
  };

  const [state, dispatch] = useReducer(
    reducer, // Pasa el servicio de persistencia al reductor
    initialState
  );

  const contextValue: ContextValue<T> = {
    loading: state.loading,
    error: state.error,
    records: state.records as T[],
    addRecord: async (record) => {
      const newRecord = await dataService.addRecord(record);
      dispatch({ type: "add", record: newRecord });
      return newRecord;
    },
    editRecord: async (record) => {
      const editdRecord = await dataService.editRecord(record);
      dispatch({ type: "edit", record });
      return editdRecord;
    },
    deleteRecord: async (record) => {
      await dataService.deleteRecord(record);
      dispatch({ type: "delete", record });
    },
    getRecords: async () => {
      const records = await dataService.getRecords();
      dispatch({ type: "get", records });
      return records;
    },
  };

  useEffect(() => {
    dataService.getRecords().then((records) => {
      dispatch({ type: "get", records });
    });
  }, []);

  return (
    <RecordsContext.Provider value={contextValue}>
      {children}
    </RecordsContext.Provider>
  );
}

function useRecordsContext<T extends RecordData>() {
  const context = useContext(RecordsContext) as ContextValue<T>;

  if (!context) {
    throw new Error("useRecordsContext must be used within a RecordsProvider");
  }

  return context;
}

export { RecordsProvider, useRecordsContext };
