import { SiteTables } from "@/components/tables/SiteTables";
import { Table } from "@/domain";
import { DataService, RecordsProvider } from "@/hooks/useRecords";

export default function TablesIndex() {
  const dataService: DataService<Table> = {
    getRecords: async (): Promise<Table[]> => {
      let tables = localStorage.getItem("tables");
      if (tables === null) {
        const initialData = [
          {
            "@odata.etag": 'W/"2023-08-16T12:39:37.047Z"',
            Id: 1,
            SiteId: 1,
            ApprovalRequired: null,
            Comments: null,
            CustomConfig: null,
            Description:
              "Comunidad social con una organización política común y un territorio y órganos de gobierno propios que es soberana e independiente políticamente de otras comunidades.",
            DisplayName: "Países",
            KeepHistoryMonths: null,
            Name: "Countries",
            Permissions: null,
            Type: 1,
            CreatedDate: "2023-08-16T12:39:37.047Z",
            CreatedUserId: 1,
            ModifiedDate: "2023-08-16T12:39:37.047Z",
            ModifiedUserId: 1,
            DeletedDate: null,
            DeletedUserId: null,
          },
          {
            "@odata.etag": 'W/"2023-08-16T12:39:37.047Z"',
            Id: 2,
            SiteId: 1,
            ApprovalRequired: null,
            Comments: null,
            CustomConfig: null,
            Description:
              "Cada una de las partes en que se divide un territorio cualquiera, un edificio, un vehículo, una caja, etc.",
            DisplayName: "Departamentos 2",
            KeepHistoryMonths: null,
            Name: "Departments2",
            Permissions: null,
            Type: 1,
            CreatedDate: "2023-08-16T12:39:37.047Z",
            CreatedUserId: 1,
            ModifiedDate: "2023-08-16T12:39:37.047Z",
            ModifiedUserId: 1,
            DeletedDate: null,
            DeletedUserId: null,
          },
        ];
        localStorage.setItem("tables", JSON.stringify(initialData));
        tables = JSON.stringify(initialData);
      }
      return JSON.parse(tables) as Table[];
    },
    addRecord: async (record) => {
      let tables = JSON.parse(localStorage.getItem("tables")!);
      let id = Math.max(...tables.map((t: Table) => t.Id)) + 1;
      record.Id = id;
      tables.push(record);
      localStorage.setItem("tables", JSON.stringify(tables));
      return record;
    },
    editRecord: async (record) => {
      let tables = JSON.parse(localStorage.getItem("tables")!);
      tables = tables.map((t: Table) => {
        if (t.Id === record.Id) {
          return record;
        }
        return t;
      });
      localStorage.setItem("tables", JSON.stringify(tables));
      return record;
    },
    deleteRecord: async (record) => {
      let tables = JSON.parse(localStorage.getItem("tables")!);
      tables = tables.filter((t: Table) => t.Id !== record.Id);
      localStorage.setItem("tables", JSON.stringify(tables));
    },
  };

  return (
    <RecordsProvider dataService={dataService}>
      <SiteTables />;
    </RecordsProvider>
  );
}
