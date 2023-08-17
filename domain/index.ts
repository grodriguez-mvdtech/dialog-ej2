export interface Error {
  code: number;
  message: string;
}

export interface RecordData {
  "@odata.etag": string;
  Id: number;
  CreatedDate: Date;
  CreatedUserId: number;
  ModifiedDate: Date;
  ModifiedUserId: number;
}

export interface Table extends RecordData {
  Comments: string;
  CustomConfig: string;
  Description: string;
  DisplayName: string;
  KeepHistoryMonths: number;
  Name: string;
  Type: number;
}

export interface ColumnCustomConfig {
  ColumnType?: string;
}

export interface Column extends RecordData {
  BooleanDefaultValue: boolean;
  ColumnType: string;
  Comments: string;
  CustomConfig: ColumnCustomConfig;
  DateTimeDefaultValue: Date | null;
  Description: string;
  DisplayName: string;
  Formula: string;
  ImageHeight: number | null;
  ImageWidth: number | null;
  IsRequired: boolean;
  IsSystem: boolean;
  IsUnique: boolean;
  LookupTableId: number;
  MaxDate: Date | null;
  MaxNumber: number | null;
  MinDate: Date | null;
  MinNumber: number | null;
  Name: string;
  NumericDefaultValue: number | null;
  Precision: number;
  RegExValidation: string;
  RegExValidationMessaje: string;
  Scale: number;
  StringDefaultValue: string;
  TableId: number;
  TextLength: number | null;
}

export interface NumericColumnCustomConfig extends ColumnCustomConfig {
  isPercentage: boolean;
}
export interface NumericColumn extends Column {
  CustomConfig: NumericColumnCustomConfig;
}

export interface DiagramColumnTypeIshikawaSettings {
  dimensions: string[];
}

export interface DiagramColumnTypeBpmnSettings {
  recordTableName: string;
  recordField: string;
  recordParentDiagramField: string;
  processTableName: string;
}

export interface DiagramColumn extends Column {
  CustomConfig?: {
    ColumnType: string;
    type: string;
    settings:
      | DiagramColumnTypeIshikawaSettings
      | DiagramColumnTypeBpmnSettings
      | null;
  };
}

type CascadingSettings = { parentName: string; lookupTableParentName: string };

type ExtraColumn = { DisplayName: string; Name: string };

export interface WorkflowColumnCustomConfig extends ColumnCustomConfig {
  editColumnName: string;
  extraColumns: ExtraColumn[];
  cascadingSettings: CascadingSettings;
  workflowExtId: string;
  workflowStateExtId: string;
}

export interface WorkflowColumn extends Column {
  CustomConfig: WorkflowColumnCustomConfig;
}

export interface FileColumnCustomConfig extends ColumnCustomConfig {
  isMultiple: boolean;
  allowedExtensions: string[];
  minFileSize: number | null;
  maxFileSize: number | null;
  minFilesCount: number | null;
  maxFilesCount: number | null;
  maxImageHeight: number | null;
  maxImageWidth: number | null;
}

export interface FileColumn extends Column {
  CustomConfig: FileColumnCustomConfig;
}

export interface ColumnTypeSettings extends RecordData {
  Name: string;
  SettingsComponentKey: string;
  ViewFormKey: string;
  ViewTableKey: string;
}

export const DIALOG_CLOSED_TYPE = {
  APPROVED: 1,
  CANCELLED: 0,
};
