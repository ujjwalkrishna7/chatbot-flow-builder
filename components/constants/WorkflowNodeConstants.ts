import messagesNode from "../messages-node";

export const nodeTypes = {
  messageNode: messagesNode,
};

export const initNodes = [
  {
    id: "0",
    type: "messageNode",
    data: {
      id: "0",
      selectedNode: null,
      setSelectedNode: null,
      message: "Initial Node",
    },
    position: { x: 0, y: 0 },
  },
];
