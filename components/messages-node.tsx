import { Icon } from "@iconify/react";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";

function MessageNode({ data }: any) {
  return (
    <div
      onClick={() => {
        console.log(data.id);
        data.setSelectedNode(data.id);
      }}
      className={`overflow-hidden rounded-xl border 
    bg-[radial-gradient(ellipse_at_center,rgba(var(--feature-color),0.15),transparent)] 
     before:pointer-events-none before:absolute before:inset-0 before:bg-glass-gradient before:rounded-2xl 
     
     ${
       data.selectedNode === data.id
         ? `border-teal-500`
         : "border-transparent-white "
     }`}
    >
      <div className="flex flex-col items-start w-full">
        <div className=" bg-teal-500/10 py-[2px] px-1 flex items-center justify-between gap-2 w-full">
          <div className="flex gap-1 items-center">
            <Icon width={10} className="" icon="icon-park-solid:message" />

            <p className=" text-[8px] font-medium">Send Message</p>
          </div>
          <div className="bg-white/10 rounded-full p-1">
            <Icon width={10} icon="mingcute:whatsapp-fill" />
          </div>
        </div>
        <div className="py-2 px-2">
          <p className="text-[8px] font-normal text-white/50">{data.message}</p>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className=" !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className=" !bg-teal-500"
      />
    </div>
  );
}

export default memo(MessageNode);
