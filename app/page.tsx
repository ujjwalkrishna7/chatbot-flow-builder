"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button, Highlight } from "@/components/button";
import { Icon } from "@iconify/react";
import MessageNode from "@/components/messages-node";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import messagesNode from "@/components/messages-node";

const nodeTypes = {
  messageNode: MessageNode,
};

const initNodes = [
  {
    id: "0",
    type: "messageNode",
    data: {
      id: "0",
      selectedNode: null,
      setSelectedNode: null,
      message: "Inital Node",
    },
    position: { x: 0, y: 0 },
  },
];

let id = 1;
const getId = () => `${id++}`;

export default function Homepage() {
  const [selectedNode, setSelectedNode] = useState("");

  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [saved, setSaved] = useState<any>();

  const [nodeMessages, setNodeMessages] = useState<string[]>(["Inital Node"]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node: any, index) => {
        node.data = {
          ...node.data,
          selectedNode: selectedNode,
          setSelectedNode: setSelectedNode,
          message: nodeMessages[index],
        };

        return node;
      })
    );
  }, [nodeMessages, setNodes, selectedNode]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesDelete = useCallback(
    (deleted: any) => {
      let msgArray: any = [];
      nodeMessages.map((msg: any) => {
        if (deleted[0].data.message !== msg) {
          msgArray.push(msg);
        }
      });
      setNodeMessages(msgArray);
      //   setEdges(
      //     deleted.reduce((acc: any, node: any) => {
      //       const incomers = getIncomers(node, nodes, edges);
      //       const outgoers = getOutgoers(node, nodes, edges);
      //       const connectedEdges = getConnectedEdges([node], edges);

      //       const remainingEdges = acc.filter(
      //         (edge: any) => !connectedEdges.includes(edge)
      //       );

      //       const createdEdges = incomers.flatMap(({ id: source }) =>
      //         outgoers.map(({ id: target }) => ({
      //           id: `${source}->${target}`,
      //           source,
      //           target,
      //         }))
      //       );

      //       return [...remainingEdges, ...createdEdges];
      //     }, edges)
      //   );
    },
    [nodes, edges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const id = getId();
      let message = `Message ${id}`;
      nodeMessages.push(message);
      const newNode = {
        id: id,
        type,
        position,
        data: {
          id: id,
          message: message,
          selectedNode: selectedNode,
          setSelectedNode: setSelectedNode,
        },
      };

      setNodes((nds: any) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleChangeMessage = (e: any) => {
    let newStack: any = [];
    nodeMessages.map((value, index) => {
      if (index === parseInt(selectedNode)) {
        newStack.push(e.target.value);
      } else {
        newStack.push(value);
      }
    });
    setNodeMessages(newStack);
  };

  const notifySuccess = (msg: string) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = (msg: string) =>
    toast.error(msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const saveHandler = () => {
    if (nodes.length === 1) {
      setSaved({
        nodes: nodes,
        edges: edges,
        nodeMessages: nodeMessages,
        id: id,
      });
      notifySuccess("Saved Successfully");
    } else {
      let errorFound = 0;
      nodes.map((node) => {
        const connectedEdges = getConnectedEdges([node], edges);
        if (connectedEdges.length === 0) {
          errorFound++;
        }
      });
      if (errorFound > 0) {
        notifyError("Cannot Save Flow");
      } else {
        setSaved({
          nodes: nodes,
          edges: edges,
          nodeMessages: nodeMessages,
          id: id,
        });
        notifySuccess("Saved Successfully");
      }
    }
  };

  const resetHandler = () => {
    try {
      setNodes(initNodes);
      setEdges([]);
      setNodeMessages(["Initail Node"]);
      setSelectedNode("");
      id = 1;
      notifySuccess("Reset Successfully");
    } catch (e) {
      notifyError("Failed");
    }
  };

  const loadHandler = () => {
    try {
      setNodes(saved.nodes);
      setEdges(saved.edges);
      setNodeMessages(saved.nodeMessages);
      setSelectedNode("");
      id = saved.id;
      notifySuccess("Load Success");
    } catch (e) {
      notifyError("Failed");
    }
  };
  return (
    <>
      <div className="mx-5 md:mx-16">
        <div className="w-full mt-5 flex flex-col-reverse md:flex-row items-start justify-between gap-4 ">
          {/* <Container> */}
          <div className="w-full md:w-8/12">
            <div className="w-full relative overflow-hidden rounded-[2.4rem] border border-transparent-white bg-[radial-gradient(ellipse_at_center,rgba(var(--feature-color),0.15),transparent)] py-6 px-8 before:pointer-events-none before:absolute before:inset-0 before:bg-glass-gradient md:rounded-[4.8rem] md:p-14">
              <ReactFlowProvider>
                <div
                  className="w-full reactflow-wrapper h-[600px] rounded-2xl"
                  ref={reactFlowWrapper}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodesDelete={onNodesDelete}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                  >
                    <Controls />
                  </ReactFlow>
                </div>
              </ReactFlowProvider>
            </div>
          </div>
          {/* </Container> */}

          {/* <Container> */}
          <div className="w-full md:w-4/12 ">
            <div
              className="relative aspect-[1.1/1] overflow-hidden rounded-[2.4rem] border
             border-transparent-white bg-[radial-gradient(ellipse_at_center,rgba(var(--feature-color),0.15),transparent)] py-6 px-5
             before:pointer-events-none before:absolute before:inset-0 before:bg-glass-gradient md:rounded-[4.8rem] "
            >
              <div className="w-full flex flex-col items-start gap-2 ">
                {selectedNode ? (
                  <>
                    <div className=" bg-white/5 border border-white/5 rounded-xl py-2 px-3 flex items-center justify-between gap-2 w-full">
                      <Icon
                        onClick={() => {
                          setSelectedNode("");
                        }}
                        width={20}
                        className="cursor-pointer"
                        icon="ion:arrow-back"
                      />

                      <p className=" text-sm font-medium">Message</p>
                      <div> </div>
                    </div>
                    <p className="font-medium text-md mt-4 text-white/50">
                      Enter Message :
                    </p>
                    <div className="w-full">
                      <textarea
                        value={nodeMessages[parseInt(selectedNode)]}
                        onChange={(e) => {
                          handleChangeMessage(e);
                        }}
                        className="w-full flex justify-between cursor-pointer items-center transition 
                         gap-1 px-5 py-3 rounded-full text-zinc-50 bg-white/5 text-xs font-
                          disabled:bg-white/5 disabled:text-zinc-50 hover:bg-white/10 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className=" bg-white/5 border border-white/5 rounded-xl py-2 px-3 flex items-center justify-between gap-2 w-full overflow-x-scroll ">
                      <div className="flex gap-2 items-center">
                        <Button
                          className=""
                          variant="secondary"
                          size="medium"
                          onClick={resetHandler}
                        >
                          <Icon
                            width={15}
                            className="my-2 mr-2"
                            icon="material-symbols:device-reset"
                          />

                          <span>Reset</span>
                        </Button>
                        {saved && (
                          <Button
                            className=""
                            variant="secondary"
                            size="medium"
                            onClick={loadHandler}
                          >
                            <Icon
                              width={15}
                              className="my-2 mr-2"
                              icon="mingcute:upload-fill"
                            />

                            <span>Load</span>
                          </Button>
                        )}
                      </div>

                      <Button
                        className=""
                        variant="secondary"
                        size="medium"
                        onClick={saveHandler}
                      >
                        <Icon
                          width={15}
                          className="my-2 mr-2"
                          icon="ic:round-save"
                        />

                        <span>Save</span>
                      </Button>
                    </div>
                    <div className="text-[11px] text-white/30  px-3">
                      Drag and Drop below elements to the left Panel to add a
                      Node :
                    </div>

                    <div
                      onDragStart={(event) => onDragStart(event, "messageNode")}
                      draggable
                    >
                      <Button className="ml-2" variant="secondary" size="large">
                        <Highlight className="uppercase">
                          <Icon
                            width={20}
                            className="my-2"
                            icon="icon-park-solid:message"
                          />
                        </Highlight>
                        <span>New Message</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* </Container> */}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
