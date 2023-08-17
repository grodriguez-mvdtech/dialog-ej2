import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  EditMode,
  EditSettingsModel,
  ForeignKey,
  GridComponent,
  Inject,
  Page,
  Search,
  SearchSettingsModel,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { ClickEventArgs } from "@syncfusion/ej2-react-navigations";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Column, Error, Table } from "@/domain";
import { DialogRecordDataProvider } from "@/hooks/useDialogRecordData";
import { useRecordsContext } from "@/hooks/useRecords";
import { showAlertDialog, showConfirmDialog } from "@/utilities/ui";

import { ColumnSettingsDialog, NEW_COLUMN_DATA } from "./ColumnSettingsDialog";

const TABLE_COLUMNS_GRID_ID = "columnsTableGrid";

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

function TableColumnSettingsContentDialog(table: Table) {
  const refGrid = useRef<GridComponent>(null);
  const { t } = useTranslation(["common", "tables", "column-type"]);

  const [seletedRecord, setSeletedRecord] = useState<Column | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { records, deleteRecord } = useRecordsContext();

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

  function handleCloseDialog() {
    setShowDialog(false);
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
      const selectedRecords = grid.getSelectedRecords() as Column[];
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
      <label htmlFor={TABLE_COLUMNS_GRID_ID}>{t("columns")}:</label>
      <GridComponent
        ref={refGrid}
        allowSorting={true}
        dataSource={records}
        editSettings={EDIT_SETTINGS}
        //height={500}
        id={TABLE_COLUMNS_GRID_ID}
        searchSettings={SEARCH_SETTINGS}
        sortSettings={{
          columns: [{ field: "DisplayName", direction: "Ascending" }],
        }}
        toolbar={["Add", "Edit", "Delete", "Search"]}
        created={handleCreated}
        toolbarClick={handleToolbarClick}
      >
        <ColumnsDirective>
          <ColumnDirective field="Id" isPrimaryKey={true} visible={false} />
          <ColumnDirective
            defaultValue={String(table.Id)}
            field="TableId"
            type="number"
            visible={false}
          />
          <ColumnDirective
            field="DisplayName"
            headerText={t("name") as string}
            type="text"
            width="200"
          />
          <ColumnDirective
            field="ColumnType"
            headerText={t("type") as string}
            type="text"
            width="120"
            template={({ ColumnType, CustomConfig }: Column) =>
              t(`${CustomConfig.ColumnType || ColumnType}`, {
                ns: "column-types",
              })
            }
          />
          <ColumnDirective
            field="Description"
            headerText={t("description") as string}
            type="text"
            width="300"
          />
          <ColumnDirective
            displayAsCheckBox={true}
            field="IsRequired"
            headerText={t("is-required") as string}
            headerTextAlign="Center"
            textAlign="Center"
            type="boolean"
            width="100"
          />
        </ColumnsDirective>
        <Inject services={[Edit, ForeignKey, Page, Search, Toolbar]} />
      </GridComponent>
      {showDialog && (
        <DialogRecordDataProvider
          initialRecordData={
            seletedRecord ?? { ...NEW_COLUMN_DATA, TableId: table.Id }
          }
        >
          <ColumnSettingsDialog closeDialog={handleCloseDialog} />
        </DialogRecordDataProvider>
      )}
    </>
  );
}

export { TableColumnSettingsContentDialog };
