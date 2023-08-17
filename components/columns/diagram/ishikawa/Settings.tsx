import {
  ChangedEventArgs as TextBoxComponentChangedEventArgs,
  TextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { Fragment, MutableRefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ValidateColumnFunction } from "@/components/tables/ColumnSettingsDialog";
import { DiagramColumn, DiagramColumnTypeIshikawaSettings } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const INITIAL_DIMENSIONS = [
  "ishikawa-dimension-1",
  "ishikawa-dimension-2",
  "ishikawa-dimension-3",
  "ishikawa-dimension-4",
  "ishikawa-dimension-5",
  "ishikawa-dimension-6",
];

const Settings = ({
  refValidateColumnTypeFunction,
}: {
  refValidateColumnTypeFunction: MutableRefObject<
    ValidateColumnFunction<DiagramColumn>
  >;
}) => {
  const { t } = useTranslation(["diagram-column"]);
  const [recordData, setRecordData] =
    useDialogRecordDataContext<DiagramColumn>();

  function handleChangeRecordData(fieldName: string, value: unknown) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }
  useEffect(() => {
    if (!recordData.CustomConfig?.settings) {
      const settings: DiagramColumnTypeIshikawaSettings = {
        dimensions: INITIAL_DIMENSIONS.map((dimensionKey) => t(dimensionKey)),
      };
      const customConfig = {
        ...recordData.CustomConfig,
        settings,
      };
      handleChangeRecordData("CustomConfig", customConfig);
    }
  }, []);

  function handleChangeDimension(index: number, value: string) {
    const settings = recordData.CustomConfig!
      .settings as DiagramColumnTypeIshikawaSettings;
    const dimensions = settings.dimensions.map((dimension, i) =>
      index === i ? value : dimension
    );

    const customConfig = {
      ...recordData.CustomConfig,
      settings: { dimensions },
    };
    handleChangeRecordData("CustomConfig", customConfig);
  }

  const settings = recordData.CustomConfig
    ?.settings as DiagramColumnTypeIshikawaSettings;

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <label>{t("upper-dimensions")}:</label>
      <div style={{ display: "flex" }}>
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-1"
          value={settings?.dimensions[0] ?? t(INITIAL_DIMENSIONS[0])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(0, value as string);
            }
          }}
        />
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-2"
          value={settings?.dimensions[1] ?? t(INITIAL_DIMENSIONS[1])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(1, value as string);
            }
          }}
        />
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-3"
          value={settings?.dimensions[2] ?? t(INITIAL_DIMENSIONS[2])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(2, value as string);
            }
          }}
        />
      </div>
      <label>{t("lower-dimensions")}:</label>
      <div style={{ display: "flex" }}>
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-4"
          value={settings?.dimensions[3] ?? t(INITIAL_DIMENSIONS[3])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(3, value as string);
            }
          }}
        />
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-5"
          value={settings?.dimensions[4] ?? t(INITIAL_DIMENSIONS[4])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(4, value as string);
            }
          }}
        />
        <TextBoxComponent
          type="text"
          id="ishikawa-dimension-6"
          value={settings?.dimensions[5] ?? t(INITIAL_DIMENSIONS[5])}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeDimension(5, value as string);
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export { Settings };
