/* eslint-disable no-use-before-define */
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  BasicShapeModel,
  ConnectorConstraints,
  ConnectorEditing,
  ConnectorModel,
  DiagramComponent,
  ICollectionChangeEventArgs,
  IDoubleClickEventArgs,
  Inject,
  ITextEditEventArgs,
  NodeConstraints,
  NodeModel,
  PathAnnotationModel,
  PointPortModel,
  StrokeStyleModel,
  UserHandleEventsArgs,
  UserHandleModel,
} from "@syncfusion/ej2-react-diagrams";
import {
  ChangedEventArgs,
  TextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { showToast, TOAST_TYPES } from "@/utilities/ui";

import styles from "./WorkflowEditor.module.css";

interface CleanNode {
  id?: string;
  width?: number;
  minHeight?: number;
  offsetX?: number;
  offsetY?: number;
  visible?: boolean;
  borderWidth?: number;
  branch?: string;
  constraints?: string;
  borderColor?: string;
  height?: number;
  annotations?: Array<{
    content?: string;
    id?: string;
    constraints?: string;
    style?: {
      textWrapping?: string;
      fontFamily?: string;
      bold?: boolean;
      textAlign?: string;
    };
  }>;
  ports?: Array<{
    id?: string;
    visibility?: string;
    shape?: string;
    offset?: {
      x?: number;
      y?: number;
    };
  }>;
  style?: {
    strokeWidth?: number;
    strokeColor?: string;
  };
  shape?: {
    shape?: string;
    cornerRadius?: number;
  };
}

const USER_HANDLES: UserHandleModel[] = [
  {
    name: "editNode",
    pathData:
      "M178.97933137082478,74.65575053132595 L162.6635453130233,64.40081517889958 C158.54702043336647,61.81600111351064 153.12278447213046,63.060071879148225 150.52894792790124,67.17745427159744 L144.09797421069536,77.41325468719985 L175.3107636635689,97.01731026187541 L181.74680935494422,86.78626126668608 C184.33080182290348,82.66397751781409 183.09755724895612,77.23480498590041 178.97933137082478,74.65575053132595 L178.97933137082478,74.65575053132595 zM88.55470751067213,165.84591585067824 L119.76919796201673,185.44976978727382 L170.64364263980468,104.46175717510408 L139.4142930103041,84.85278473338812 L88.5547023404635,165.84591068046996 L88.55470751067213,165.84591585067824 zM83.78670021575627,190.75334247582438 L83.09728398347896,209.16690614201394 L99.38804106374928,200.55019747086533 L114.52678270992888,192.55698476606764 L84.41316399389439,173.63255809724808 L83.78670538596461,190.7533476460309 L83.78670538596461,190.7533476460309 L83.78670021575627,190.75334247582438 z",
    visible: true,
    backgroundColor: "black",
    pathColor: "white",
    side: "Left",
    offset: 0.5,
  },
  {
    name: "addTransition",
    pathData: "M40,10 L40,70 H55 V10 H70 V0 H25 V10 H40 Z",
    visible: true,
    backgroundColor: "black",
    pathColor: "white",
    side: "Right",
    offset: 0,
  },
  {
    name: "addAutomaticTransition",
    pathData: "M30,90 L50,10 L70,90 H60 L55,75 H45 L40,90 H30 M45,60 H55",
    visible: true,
    backgroundColor: "black",
    pathColor: "white",
    side: "Right",
    offset: 1,
  },
  {
    name: "editConnector",
    pathData:
      "M178.97933137082478,74.65575053132595 L162.6635453130233,64.40081517889958 C158.54702043336647,61.81600111351064 153.12278447213046,63.060071879148225 150.52894792790124,67.17745427159744 L144.09797421069536,77.41325468719985 L175.3107636635689,97.01731026187541 L181.74680935494422,86.78626126668608 C184.33080182290348,82.66397751781409 183.09755724895612,77.23480498590041 178.97933137082478,74.65575053132595 L178.97933137082478,74.65575053132595 zM88.55470751067213,165.84591585067824 L119.76919796201673,185.44976978727382 L170.64364263980468,104.46175717510408 L139.4142930103041,84.85278473338812 L88.5547023404635,165.84591068046996 L88.55470751067213,165.84591585067824 zM83.78670021575627,190.75334247582438 L83.09728398347896,209.16690614201394 L99.38804106374928,200.55019747086533 L114.52678270992888,192.55698476606764 L84.41316399389439,173.63255809724808 L83.78670538596461,190.7533476460309 L83.78670538596461,190.7533476460309 L83.78670021575627,190.75334247582438 z",
    visible: true,
    backgroundColor: "#0078d4",
    pathColor: "white",
    side: "Left",
    margin: { right: 25 },
  },
];

const NODE_PORTS: PointPortModel[] = [
  {
    id: "port1",
    shape: "Circle",
    offset: { x: 0, y: 0.25 },
    height: 8,
    width: 8,
  },
  {
    id: "port2",
    shape: "Circle",
    offset: { x: 0, y: 0.5 },
    height: 8,
    width: 8,
  },
  {
    id: "port3",
    shape: "Circle",
    offset: { x: 0, y: 0.75 },
    height: 8,
    width: 8,
  },
  {
    id: "port4",
    shape: "Circle",
    offset: { x: 1, y: 0.25 },
    height: 8,
    width: 8,
  },
  {
    id: "port5",
    shape: "Circle",
    offset: { x: 1, y: 0.5 },
    height: 8,
    width: 8,
  },
  {
    id: "port6",
    shape: "Circle",
    offset: { x: 1, y: 0.75 },
    height: 8,
    width: 8,
  },
  {
    id: "port7",
    shape: "Circle",
    offset: { x: 0.2, y: 0 },
    height: 8,
    width: 8,
  },
  {
    id: "port8",
    shape: "Circle",
    offset: { x: 0.4, y: 0 },
    height: 8,
    width: 8,
  },
  {
    id: "port9",
    shape: "Circle",
    offset: { x: 0.6, y: 0 },
    height: 8,
    width: 8,
  },
  {
    id: "port10",
    shape: "Circle",
    offset: { x: 0.8, y: 0 },
    height: 8,
    width: 8,
  },
  {
    id: "port11",
    shape: "Circle",
    offset: { x: 0.2, y: 1 },
    height: 8,
    width: 8,
  },
  {
    id: "port12",
    shape: "Circle",
    offset: { x: 0.4, y: 1 },
    height: 8,
    width: 8,
  },
  {
    id: "port13",
    shape: "Circle",
    offset: { x: 0.6, y: 1 },
    height: 8,
    width: 8,
  },
  {
    id: "port14",
    shape: "Circle",
    offset: { x: 0.8, y: 1 },
    height: 8,
    width: 8,
  },
];

const STATES_RECORDS_DATA: Record<
  string,
  | { "@odata.etag": string; Id: number; ExtId: string }
  | { Id: number; ExtId: string }
> = {};
const TRANSITIONS_RECORDS_DATA: Record<
  string,
  { "@odata.etag": string; Id: number } | { Id: number }
> = {};

const ENTITY_TYPE = {
  WORKFLOW: "WORKFLOW",
  STATE: "STATES",
  TRANSITION: "TRANSITIONS",
};

type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

const TABLES = {
  WORKFLOW: "MVDWorkflows",
  STATES: "MVDWorkflowsStates",
  TRANSITIONS: "MVDWorkflowsTransitions",
};

const TABLES_INFO: Record<string, null> = {
  WORKFLOW: null,
  STATES: null,
  TRANSITIONS: null,
};

function getNewLabel(text: string) {
  const textList = text.split(" ");
  let result = textList[0];
  for (let i = 1; i < textList.length; i++) {
    const rows = result.split("\n");
    const text = textList[i].split("\n");
    const width = (rows[rows.length - 1].length + text[0].length + 1) * 6;
    if (width <= 120) {
      result += ` ${textList[i]}`;
    } else {
      result += `\n${textList[i]}`;
    }
  }
  return result;
}
function getCleanNode(node: NodeModel) {
  const newNode: CleanNode = {};
  for (const key in node) {
    if (
      [
        "id",
        "width",
        "minHeight",
        "offsetX",
        "offsetY",
        "visible",
        "borderWidth",
        "branch",
        "constraints",
        "borderColor",
        "height",
      ].includes(key)
    )
      newNode[key] = node[key];
    else if (key === "annotations") {
      newNode[key] = [];
      node[key].forEach(function (label) {
        const newLabel = {};
        for (const keyProp in label) {
          if (["content"].includes(keyProp))
            newLabel[keyProp] = getNewLabel(label[keyProp]);
          else if (["id", "constraints"].includes(keyProp))
            newLabel[keyProp] = label[keyProp];
          else if (keyProp === "style") {
            newLabel[keyProp] = {};
            for (const keyPropStyle in label[keyProp]) {
              if (
                ["textWrapping", "fontFamily", "bold", "textAlign"].includes(
                  keyPropStyle
                )
              )
                newLabel[keyProp][keyPropStyle] = label[keyProp][keyPropStyle];
            }
          }
        }
        newNode[key].push(newLabel);
      });
    } else if (key === "ports") {
      newNode[key] = [];
      node[key].forEach(function (port) {
        const newPort = {};
        for (const keyProp in port) {
          if (["id", "visibility", "shape"].includes(keyProp))
            newPort[keyProp] = port[keyProp];
          if (keyProp === "offset") {
            newPort[keyProp] = {};
            for (const keyPropOffset in port[keyProp]) {
              if (["x", "y"].includes(keyPropOffset))
                newPort[keyProp][keyPropOffset] = port[keyProp][keyPropOffset];
            }
          }
        }
        newNode[key].push(newPort);
      });
    } else if (key === "style") {
      newNode.style = {
        strokeWidth: node[key].strokeWidth,
        strokeColor: node[key].strokeColor,
      };
    } else if (key === "shape") {
      newNode.shape = {
        shape: node[key].shape,
        cornerRadius: node[key].cornerRadius,
      };
    }
  }
  return newNode;
}
function getCleanConnector(connector: ConnectorModel) {
  const newConnector = {};
  for (const key in connector) {
    if (
      [
        "constraints",
        "cornerRadius",
        "id",
        "sourceID",
        "sourcePortID",
        "targetID",
        "targetPortID",
        "type",
        "visible",
      ].includes(key)
    )
      newConnector[key] = connector[key];
    else if (["targetDecorator"].includes(key)) {
      newConnector[key] = {};
      for (const keyProp in connector[key]) {
        if (["shape"].includes(keyProp))
          newConnector[key][keyProp] = connector[key][keyProp];
      }
    } else if (key === "annotations") {
      newConnector[key] = [];
      connector[key].forEach(function (label) {
        const newLabel = {};
        for (const keyProp in label) {
          if (["content"].includes(keyProp))
            newLabel[keyProp] = getNewLabel(label[keyProp]);
          else if (
            [
              "id",
              "constraints",
              "verticalAlignment",
              "horizontalAlignment",
            ].includes(keyProp)
          )
            newLabel[keyProp] = label[keyProp];
          else if (keyProp === "style") {
            newLabel[keyProp] = {};
            for (const keyPropStyle in label[keyProp]) {
              if (
                ["textWrapping", "fontFamily", "bold", "textAlign"].includes(
                  keyPropStyle
                )
              )
                newLabel[keyProp][keyPropStyle] = label[keyProp][keyPropStyle];
            }
          }
        }
        newConnector[key].push(newLabel);
      });
    } else if (key === "segments") {
      newConnector[key] = [];
      connector[key].forEach(function (segment) {
        const newSegment = {};
        for (const keyProp in segment) {
          if (
            ["points", "type", "length", "direction", "allowDrag"].includes(
              keyProp
            )
          )
            newSegment[keyProp] = segment[keyProp];
        }
        newConnector[key].push(newSegment);
      });
    }
  }
  return newConnector;
}
function getCleanDiagramData(diagram: DiagramComponent) {
  const nodes = diagram.nodes.map(getCleanNode);
  const connectors = diagram.connectors.map(getCleanConnector);
  return { nodes, connectors };
}
function getEntityTypeByTableName(tableName: string) {
  if (tableName === TABLES.WORKFLOW) {
    return ENTITY_TYPE.WORKFLOW;
  }
  if (tableName === TABLES.STATES) {
    return ENTITY_TYPE.STATE;
  }
  return ENTITY_TYPE.TRANSITION;
}

function WorkflowEditor({
  handleClickSaveCustomRef,
  recordId,
  closeDialog,
}: {
  handleClickSaveCustomRef: MutableRefObject<(() => Promise<boolean>) | null>;
  recordId: number;
}) {
  const { t } = useTranslation("workflow");
  const diagramInstanceRef = useRef(null);
  const [name, setTitle] = useState("");
  const [diagramData, setDiagramData] = useState<{
    nodes: NodeModel[];
    connectors: ConnectorModel[];
  }>({ nodes: [], connectors: [] });

  function getCurrentEntityRecordId(entityType: string) {
    if (entityType === ENTITY_TYPE.WORKFLOW) {
      const formDataManager = getFormDataManager(ENTITY_TYPE.WORKFLOW);
      return recordId ? recordId : formDataManager.formDataManagerRecords[0].id;
    }
    const diagram = diagramInstanceRef.current as DiagramComponent;
    const selectedObjects = diagram.selectedItems.selectedObjects as (
      | NodeModel
      | ConnectorModel
    )[];
    const shapeId = selectedObjects[0].id as string;

    return (
      STATES_RECORDS_DATA[shapeId]?.Id || TRANSITIONS_RECORDS_DATA[shapeId]?.Id
    );
  }

  function getFormDataManager(entityType: string) {
    const formDataManager = formDataManagerRef.current as FormDataManager;
    if (entityType === ENTITY_TYPE.WORKFLOW) {
      return formDataManager;
    }
    const relatedFormDataManagerName =
      entityType === ENTITY_TYPE.STATE ? "States" : "Transitions";
    return formDataManager.getRelatedFormDataManager(
      relatedFormDataManagerName
    );
  }

  function getFormDataManagerClone(entityType: string) {
    const formDataManager = formDataManagerRef.current as FormDataManager;
    let formDataMangerToClone: FormDataManager;
    if (entityType === ENTITY_TYPE.WORKFLOW) {
      formDataMangerToClone = formDataManager;
    } else {
      const relatedFormDataManagerName =
        entityType === ENTITY_TYPE.STATE ? "States" : "Transitions";
      formDataMangerToClone = formDataManager.getRelatedFormDataManager(
        relatedFormDataManagerName
      );
    }
    const copyFormDataManager = formDataMangerToClone.getClone();
    return copyFormDataManager;
  }

  function getParentEntityId(entityType: string) {
    if (entityType !== ENTITY_TYPE.WORKFLOW) {
      const workflowFormDataManager = getFormDataManagerClone(
        ENTITY_TYPE.WORKFLOW
      );
      return workflowFormDataManager.formDataManagerRecords[0].id;
    }
    return 0;
  }

  async function handleCloseDialogForm(
    dialogCloseType: number,
    relatedFormDataManager: FormDataManager,
    recordId: number
  ) {
    if (dialogCloseType === DIALOG_CLOSED_TYPE.APPROVED) {
      const diagram = diagramInstanceRef.current as DiagramComponent;
      const tableName = relatedFormDataManager.table.Name;
      const entityType = getEntityTypeByTableName(tableName);
      const formDataManagerToUpdate = getFormDataManager(entityType);
      formDataManagerToUpdate.mergeClone(relatedFormDataManager);
      const formDataManagerRecord =
        formDataManagerToUpdate.getFormDataManagerRecord(
          recordId
        ) as FormDataManagerRecord;
      if (entityType === ENTITY_TYPE.WORKFLOW) {
        setTitle(formDataManagerRecord.data.Name);
      } else {
        const shapeProperty =
          entityType === ENTITY_TYPE.STATE ? "NodeId" : "ConnectorId";
        const diagramObjectPropertyName =
          entityType === ENTITY_TYPE.STATE ? "nodes" : "connectors";
        const diagramObjects = diagram[diagramObjectPropertyName] as (
          | NodeModel
          | ConnectorModel
        )[];
        const diagramObject = diagramObjects.find(
          (e) => e.id === formDataManagerRecord.data[shapeProperty]
        ) as NodeModel | ConnectorModel;
        const annotations = diagramObject.annotations as PathAnnotationModel[];
        annotations[0].content = formDataManagerRecord.data.Name || "";
      }
    }
  }

  async function openDialogForm(entityType: string) {
    const tableInfo = TABLES_INFO[entityType];
    const formDataManager = getFormDataManagerClone(entityType);
    const parentEntityId = getParentEntityId(entityType);
    const recordId = getCurrentEntityRecordId(entityType);
    const formType = recordId ? FORM_TYPES.EDIT : FORM_TYPES.NEW;
    const dialogForm = await renderChildDialog({
      closeDialogCallback: handleCloseDialogForm,
      tableInfo,
      formDataManager,
    });

    const openRecordConfig = {
      formType,
      parentEntityId,
      recordId,
      tableInfo,
    };
    dialogForm.openItem(openRecordConfig);
  }

  function handleClickAddState() {
    const random = crypto.randomUUID().split("-")[1];
    const nodeId = `State_${random}`;
    const node: NodeModel = {
      annotations: [{ content: t("new-state") as string }],
      id: nodeId,
      height: 60,
      offsetX: 80,
      offsetY: 50,
      ports: NODE_PORTS.map((port) => structuredClone(port)),
      shape: {
        type: "Basic",
        shape: "Rectangle",
        cornerRadius: 15,
      },
      style: {
        fill: "white",
        strokeColor: "black",
        strokeWidth: 2,
      },
      width: 120,
      constraints:
        NodeConstraints.Default &
        ~NodeConstraints.Resize &
        ~NodeConstraints.Rotate,
    };
    const diagram = diagramInstanceRef.current as DiagramComponent;
    diagram.add(node);
  }

  const handleChangeName = ({ isInteracted, value }: ChangedEventArgs) => {
    if (isInteracted) {
      const trimmedValue = value?.trim() as string;
      setTitle(trimmedValue);
    }
  };

  //#region Diagram
  function getCustomTool(action: string) {
    if (action === "editNode") {
      openDialogForm(ENTITY_TYPE.STATE);
    }
    if (action === "editConnector") {
      openDialogForm(ENTITY_TYPE.TRANSITION);
    }
    if (action === "Draw") {
      const diagram = diagramInstanceRef.current as DiagramComponent;
      const userHandles = diagram.selectedItems
        .userHandles as UserHandleModel[];
      userHandles[1].name = "addTransition";
      userHandles[2].name = "addAutomaticTransition";
    }
  }

  function handleCollectionChange({
    element,
    state,
    type,
  }: ICollectionChangeEventArgs) {
    if (state !== "Changed" || element.id?.startsWith("AutomaticTransition_"))
      return;

    const shapeType = (element.shape as BasicShapeModel).type as string;
    const entityType =
      shapeType === "None" ? ENTITY_TYPE.TRANSITION : ENTITY_TYPE.STATE;
    const shapeProperty =
      entityType === ENTITY_TYPE.STATE ? "NodeId" : "ConnectorId";
    if (type === "Addition") {
      const annotations = element.annotations as PathAnnotationModel[];
      const name = annotations[0] ? annotations[0].content : "";
    }

    if (type === "Removal") {
      const data = {
        "@odata.etag":
          entityType === ENTITY_TYPE.STATE
            ? STATES_RECORDS_DATA[element.id as string]["@odata.etag"]
            : TRANSITIONS_RECORDS_DATA[element.id as string]["@odata.etag"],
        [shapeProperty]: element.id,
      };
      if (!data["@odata.etag"]) {
        delete data["@odata.etag"];
      }
    }
  }

  function handleDobleClick(event: IDoubleClickEventArgs) {
    const source = event.source as ConnectorModel;
    const sourceId = source.id as string;
    if (sourceId.startsWith("AutomaticTransition")) {
      const editTextBoxDiv = document.getElementById(
        "workflowDiagram_editTextBoxDiv"
      ) as HTMLElement;
      editTextBoxDiv.style.display = "none";
    }
  }

  function handleSelectionChange() {
    const diagram = diagramInstanceRef.current as DiagramComponent;
    const userHandles = diagram.selectedItems.userHandles as UserHandleModel[];
    userHandles.forEach((e) => {
      e.visible = false;
    });
    const selectedObjects = diagram.selectedItems.selectedObjects as (
      | NodeModel
      | ConnectorModel
    )[];

    if (selectedObjects.length === 1) {
      const selectedObject = selectedObjects[0];
      if (selectedObject.id?.startsWith("State")) {
        userHandles[0].visible = true;
        userHandles[1].visible = true;
        userHandles[2].visible = true;
      } else if (selectedObject.id?.startsWith("Transition")) {
        userHandles[3].visible = true;
      }
    }
  }

  function handleOnUserHandleMouseDown(args: UserHandleEventsArgs) {
    if (
      ["addAutomaticTransition", "addTransition"].includes(
        args.element.name as string
      )
    ) {
      args.element.name = "Draw";
      const isAutomatic = args.element.offset === 1;
      const random = crypto.randomUUID().split("-")[1];
      const connectorId = isAutomatic
        ? `AutomaticTransition_${random}`
        : `Transition_${random}`;
      const diagram = diagramInstanceRef.current as DiagramComponent;
      const selectedObjects = diagram.selectedItems
        .selectedObjects as NodeModel[];
      const selectedNode = selectedObjects[0];
      const connector: ConnectorModel = {
        // Unique name for the connector
        annotations: [
          {
            content: t("new-transition") as string,
            horizontalAlignment: "Center",
            verticalAlignment: "Bottom",
          },
        ],
        id: connectorId,
        sourceID: selectedNode.id,
        style: {
          fill: "black",
          strokeColor: "black",
          strokeWidth: 1.5,
        },
        type: "Orthogonal",
        targetDecorator: {
          shape: "Arrow",
          style: {
            fill: "black",
            strokeColor: "black",
          },
        },
        targetPoint: {
          x: (selectedNode.offsetX as number) + (selectedNode.width as number),
          y: selectedNode.offsetY as number,
        },
        constraints:
          ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb,
      };
      if (isAutomatic) {
        delete connector.annotations;
        (connector.style as StrokeStyleModel).strokeDashArray = "5,5";
      }
      diagram.drawingObject = connector;
      diagram.dataBind();
    }
  }

  //#endregion Diagram
  window.diagramInstanceRef = diagramInstanceRef;

  return (
    <DialogComponent
      //ref={refDialog}
      buttons={[
        {
          buttonModel: {
            content: t("save") as string,
            isPrimary: true,
          },
          click: () => {
            closeDialog();
          },
        },
        {
          buttonModel: {
            content: t("cancel") as string,
          },
          click: () => {
            closeDialog();
          },
        },
      ]}
      height="800px"
      className={"column-settings-dialog"}
      // header={`${
      //   recordData.Id === 0 ? (t("add") as string) : (t("edit") as string)
      // } ${t("column") as string}`}
      isModal={true}
      target={"#__next"}
      showCloseIcon={true}
      close={() => {
        closeDialog();
      }}
    >
      <div className={styles["workflow-editor__header"]}>
        <div className={styles["workflow-editor__header__column-name"]}>
          <label
            id="label-workflowName"
            htmlFor="workflowName"
            className="mvd-form-label"
          >
            {t("name")}
          </label>
          <TextBoxComponent
            type="text"
            id="workflowName"
            value={name}
            change={handleChangeName}
          />
        </div>
        <div className={styles["workflow-editor__header__column-buttons"]}>
          <ButtonComponent
            onClick={() => {
              openDialogForm(ENTITY_TYPE.WORKFLOW);
            }}
            iconCss="e-icons e-edit"
          >
            {t("edit-workflow")}
          </ButtonComponent>
          <ButtonComponent
            onClick={handleClickAddState}
            iconCss="e-icons e-plus"
          >
            {t("add-state")}
          </ButtonComponent>
        </div>
      </div>

      <DiagramComponent
        ref={diagramInstanceRef}
        connectors={diagramData.connectors}
        drawingObject={{ type: "Orthogonal" }}
        id="workflowDiagram"
        nodes={diagramData.nodes}
        selectedItems={{ userHandles: USER_HANDLES as UserHandleModel[] }}
        snapSettings={{ snapAngle: 5 }}
        collectionChange={handleCollectionChange}
        doubleClick={handleDobleClick}
        getConnectorDefaults={(connector: ConnectorModel) => {
          connector.constraints =
            ConnectorConstraints.Default |
            ConnectorConstraints.DragSegmentThumb;
          return connector;
        }}
        getCustomTool={getCustomTool}
        onUserHandleMouseDown={handleOnUserHandleMouseDown}
        selectionChange={handleSelectionChange}
      >
        <Inject services={[ConnectorEditing]} />
      </DiagramComponent>
    </DialogComponent>
  );
}

export default WorkflowEditor;
