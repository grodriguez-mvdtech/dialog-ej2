import {
  ChangeEventArgs as CheckBoxChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangeEventArgs as MultiSelectChangeEventArgs,
  CheckBoxSelection,
  Inject,
  MultiSelectComponent,
} from "@syncfusion/ej2-react-dropdowns";
import {
  ChangeEventArgs as NumericTextBoxChangeEventArgs,
  NumericTextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { Fragment, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import { ValidateColumnFunction } from "@/components/tables/ColumnSettingsDialog";
import { FileColumn } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const ALLOWED_EXTENSIONS = [
  { category: "images", value: ".jpg" },
  { category: "images", value: ".jpeg" },
  { category: "images", value: ".png" },
  { category: "images", value: ".gif" },
  { category: "images", value: ".bmp" },
  { category: "images", value: ".webp" },
  { category: "images", value: ".svg" },
  { category: "images", value: ".ico" },
  { category: "documents", value: ".txt" },
  { category: "documents", value: ".doc" },
  { category: "documents", value: ".docx" },
  { category: "documents", value: ".pdf" },
  { category: "documents", value: ".xls" },
  { category: "documents", value: ".xlsx" },
  { category: "documents", value: ".csv" },
  { category: "documents", value: ".ppt" },
  { category: "documents", value: ".pptx" },
  { category: "documents", value: ".xml" },
  { category: "audio", value: ".mp3" },
  { category: "audio", value: ".wav" },
  { category: "audio", value: ".ogg" },
  { category: "audio", value: ".wma" },
  { category: "audio", value: ".aac" },
  { category: "audio", value: ".flac" },
  { category: "video", value: ".mp4" },
  { category: "video", value: ".mov" },
  { category: "video", value: ".avi" },
  { category: "video", value: ".webm" },
  { category: "video", value: ".mkv" },
  { category: "video", value: ".wmv" },
  { category: "video", value: ".flv" },
  { category: "video", value: ".3gp" },
  { category: "compressed-files", value: ".zip" },
  { category: "compressed-files", value: ".rar" },
  { category: "compressed-files", value: ".7z" },
  { category: "compressed-files", value: ".tar" },
  { category: "compressed-files", value: ".gz" },
  { category: "compressed-files", value: ".tgz" },
];

const Settings = ({
  refValidateColumnTypeFunction,
}: {
  refValidateColumnTypeFunction: MutableRefObject<
    ValidateColumnFunction<FileColumn>
  >;
}) => {
  const { t } = useTranslation(["file-column", "columns", "common"]);

  const [recordData, setRecordData] = useDialogRecordDataContext<FileColumn>();

  const {
    isMultiple,
    allowedExtensions,
    minFileSize,
    maxFileSize,
    minFilesCount,
    maxFilesCount,
    maxImageHeight,
    maxImageWidth,
  } = recordData.CustomConfig;

  function handleChangeRecordData(fieldName: string, value: any) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  function handleChangeCustomConfig(key: string, value: any) {
    const customConfig = {
      isMultiple,
      allowedExtensions,
      minFileSize,
      maxFileSize,
      minFilesCount,
      maxFilesCount,
      maxImageHeight,
      maxImageWidth,
      [key]: value,
    };
    handleChangeRecordData("CustomConfig", customConfig);
  }

  refValidateColumnTypeFunction.current = (recordData: FileColumn) => {
    const minNumber = recordData.MinNumber;
    const maxNumber = recordData.MaxNumber;
    const defaultValue = recordData.NumericDefaultValue;

    if (minNumber && maxNumber && minNumber > maxNumber) {
      const errorMessages = [
        t("error-message-selected-interval", { ns: "number-column" }) as string,
      ];
      return errorMessages;
    }
    if (
      defaultValue &&
      ((minNumber && defaultValue < minNumber) ||
        (maxNumber && defaultValue > maxNumber))
    ) {
      const errorMessages = [
        t("error-message-default-value", { ns: "number-column" }) as string,
      ];
      return errorMessages;
    }
    return null;
  };

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <div>
        <label htmlFor="IsMultiple">
          {t("is-multiple", { ns: "columns" })}:
        </label>
        <CheckBoxComponent
          checked={isMultiple}
          disabled={recordData.Id !== 0}
          id="IsMultiple"
          name="IsMultiple"
          change={({ checked }: CheckBoxChangeEventArgs) => {
            handleChangeCustomConfig("isMultiple", checked);
          }}
        />
      </div>

      <div>
        <label htmlFor="AllowedExtensions">{t("allowed-extensions")}:</label>
        <MultiSelectComponent
          id="checkbox"
          dataSource={ALLOWED_EXTENSIONS}
          enableGroupCheckBox={true}
          fields={{ text: "value", value: "value", groupBy: "category" }}
          mode={"CheckBox"}
          placeholder={t("placeholder-select-extensions") as string}
          value={allowedExtensions.length > 0 ? allowedExtensions : ["All"]}
          change={({ isInteracted, value }: MultiSelectChangeEventArgs) => {
            if (isInteracted) {
              handleChangeCustomConfig("allowedExtensions", value);
            }
          }}
          groupTemplate={(item: { category: string; value: string }) => (
            <strong>{t(item.category, { ns: "common" }) as string}</strong>
          )}
        >
          <Inject services={[CheckBoxSelection]} />
        </MultiSelectComponent>
      </div>

      <div>
        <label htmlFor="MinFileSize">{t("min-file-size")}:</label>
        <NumericTextBoxComponent
          format="N"
          id="MinFileSize"
          name="MinFileSize"
          min={0}
          value={minFileSize ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              const minFileSize = value ? value : null;
              handleChangeCustomConfig("minFileSize", minFileSize);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="MaxFileSize">{t("max-file-size")}:</label>
        <NumericTextBoxComponent
          format="N"
          id="MaxFileSize"
          name="MaxFileSize"
          min={0}
          value={maxFileSize ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              const maxFileSize = value ? value : null;
              handleChangeCustomConfig("maxFileSize", maxFileSize);
            }
          }}
        />
      </div>
      {isMultiple && (
        <>
          <div>
            <label htmlFor="MinFilesCount">{t("min-files-count")}:</label>
            <NumericTextBoxComponent
              format="N"
              id="MinFilesCount"
              name="MinFilesCount"
              min={0}
              value={minFilesCount ?? undefined}
              change={({
                isInteracted,
                value,
              }: NumericTextBoxChangeEventArgs) => {
                if (isInteracted) {
                  const minFilesCount = value ? value : null;
                  handleChangeCustomConfig("minFilesCount", minFilesCount);
                }
              }}
            />
          </div>
          <div>
            <label htmlFor="MaxFilesCount">{t("max-files-count")}:</label>
            <NumericTextBoxComponent
              format="N"
              id="MaxFileCount"
              name="MaxFilesCount"
              min={0}
              value={maxFilesCount ?? undefined}
              change={({
                isInteracted,
                value,
              }: NumericTextBoxChangeEventArgs) => {
                if (isInteracted) {
                  const maxFilesCount = value ? value : null;
                  handleChangeCustomConfig("maxFilesCount", maxFilesCount);
                }
              }}
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="MaxImageHeight">{t("max-image-height")}:</label>
        <NumericTextBoxComponent
          format="N"
          id="MaxImageHeight"
          name="MaxImageHeight"
          min={0}
          value={maxImageHeight ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              const maxImageHeight = value ? value : null;
              handleChangeCustomConfig("maxImageHeight", maxImageHeight);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="MaxImageWidth">{t("max-image-width")}:</label>
        <NumericTextBoxComponent
          format="N"
          id="MaxImageWidth"
          name="MaxImageWidth"
          min={0}
          value={maxImageWidth ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              const maxImageWidth = value ? value : null;
              handleChangeCustomConfig("maxImageWidth", maxImageWidth);
            }
          }}
        />
      </div>
      <span>{t("message-max-image")}</span>
    </Fragment>
  );
};

export default Settings;
