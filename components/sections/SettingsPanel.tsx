import React from "react";
import { Button, Highlight } from "../button";
import { Icon } from "@iconify/react";

export const SettingsPanel = ({
  selectedNode,
  setSelectedNode,
  nodeMessages,
  handleChangeMessage,
  saved,
  saveHandler,
  onDragStart,
  loadHandler,
  resetHandler,
}: any) => {
  return (
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
                value={nodeMessages[parseInt(selectedNode)].message}
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
            <div className=" bg-white/5 border border-white/5 rounded-xl py-2 px-3 flex items-center justify-between gap-2 w-full overflow-x-scroll hide-scrollbar ">
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
                <Icon width={15} className="my-2 mr-2" icon="ic:round-save" />

                <span>Save</span>
              </Button>
            </div>
            <div className="text-[11px] text-white/30  px-3">
              Drag and Drop below elements to the left Panel to add a Node :
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
  );
};
