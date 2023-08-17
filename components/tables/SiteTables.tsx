import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  EditMode,
  EditSettingsModel,
  GridComponent,
  Inject,
  Page,
  Search,
  SearchSettingsModel,
  Sort,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { ClickEventArgs } from "@syncfusion/ej2-react-navigations";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Error, Table } from "@/domain";
import { useRecordsContext } from "@/hooks/useRecords";
import { showAlertDialog, showConfirmDialog } from "@/utilities/ui";

import { TableSettingsDialog } from "./TableSettingsDialog";

const EDIT_SETTINGS: EditSettingsModel = {
  allowAdding: true,
  allowDeleting: true,
  allowEditing: true,
  allowEditOnDblClick: false,
  mode: "Dialog" as EditMode,
  showDeleteConfirmDialog: true,
};

const SEARCH_SETTINGS: SearchSettingsModel = {
  fields: ["DisplayName"],
  ignoreAccent: true,
  ignoreCase: true,
  operator: "contains",
};

const SiteTables = () => {
  const refGrid = useRef<GridComponent>(null);
  const { t } = useTranslation(["common", "tables"]);

  const [seletedRecord, setSeletedRecord] = useState<Table | null>(null);
  const { records, deleteRecord } = useRecordsContext<Table>();
  const [showDialog, setShowDialog] = useState(false);

  function handleCloseDialog() {
    setShowDialog(false);
  }

  function handleCreated() {
    const grid = refGrid.current!;
    const searchElement = document.getElementById(
      `${grid.element.id}_searchbar`
    )!;
    searchElement.addEventListener("keyup", (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement;
      grid.search(target.value);
    });
  }

  async function handleToolbarClick(args: ClickEventArgs) {
    const grid = refGrid.current!;
    const itemId = args.item.id!;
    if (itemId.endsWith("_add")) {
      args.cancel = true;
      setSeletedRecord(null);
      setShowDialog(true);
    } else if (itemId.endsWith("_edit")) {
      args.cancel = true;
      const selectedRecords = grid.getSelectedRecords() as Table[];
      if (selectedRecords.length === 0) {
        showAlertDialog({
          title: t("error", { ns: "common" }) as string,
          content: t("select-record-to-edit") as string,
        });
      } else {
        setSeletedRecord(selectedRecords[0]);
        setShowDialog(true);
      }
    } else if (itemId.endsWith("_delete")) {
      args.cancel = true;
      const confirm = await showConfirmDialog({
        cancelTextButton: t("cancel", { ns: "common" }),
        content: t("warning-message-delete") as string,
        okTextButton: t("delete", { ns: "common" }),
        title: t("attention", { ns: "common" }),
      });
      if (confirm) {
        try {
          const selectedRecords = grid.getSelectedRecords() as Table[];
          deleteRecord(selectedRecords[0]);
        } catch (error) {
          const { code, message } = error as Error;
          showAlertDialog({
            title: t("error", { ns: "common" }) as string,
            content: message,
          });
        }
      }
    }
  }

  return (
    <>
      <GridComponent
        ref={refGrid}
        allowPaging={true}
        allowSorting={true}
        dataSource={records}
        editSettings={EDIT_SETTINGS}
        height="100%"
        id="siteTablesGrid"
        pageSettings={{ pageSize: 15 }}
        searchSettings={SEARCH_SETTINGS}
        sortSettings={{
          columns: [{ field: "DisplayName", direction: "Ascending" }],
        }}
        toolbar={["Add", "Edit", "Delete", "Search"]}
        toolbarClick={handleToolbarClick}
        created={handleCreated}
      >
        <ColumnsDirective>
          <ColumnDirective field="Id" isPrimaryKey={true} visible={false} />
          <ColumnDirective field="Name" visible={false} />
          <ColumnDirective
            allowEditing={false}
            field="DisplayName"
            headerText={t("name") as string}
            type="text"
            template={({ DisplayName, Name }: Table) => (
              <Link href={`./tables/${Name}/Default`}>{DisplayName}</Link>
            )}
          />
          <ColumnDirective
            field="Type"
            headerText={t("type") as string}
            type="text"
            template={({ Type }: Table) =>
              Type === 1 ? t("table") : t("document-repository")
            }
          />
          <ColumnDirective
            field="Description"
            headerText={t("description") as string}
            type="text"
          />
          <ColumnDirective
            field="Comments"
            headerText={t("comments") as string}
            type="text"
          />
        </ColumnsDirective>
        <Inject services={[Edit, Page, Search, Sort, Toolbar]} />
      </GridComponent>
      {showDialog && (
        <TableSettingsDialog
          closeDialog={handleCloseDialog}
          record={seletedRecord}
        />
      )}
    </>
  );
};

export { SiteTables };
