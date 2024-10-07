import type React from "react";
import { memo } from "react";
import { useDappStaking } from "@/hooks";

const ProtocolState: React.FC = () => {
  const { protocolState } = useDappStaking();

  return (
    <div>
      Era <b>{protocolState?.era}</b>, period{" "}
      <b>{protocolState?.periodInfo.number}</b>, subperiod{" "}
      <b>{protocolState?.periodInfo.subperiod}</b>, next era block{" "}
      <b>{protocolState?.nextEraStart}</b>
    </div>
  );
};

export default memo(ProtocolState);
