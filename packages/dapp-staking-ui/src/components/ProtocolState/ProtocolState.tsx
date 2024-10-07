import type React from "react";
import { memo } from "react";
import { useApi, useDappStaking } from "@/hooks";

const ProtocolState: React.FC = () => {
  const { protocolState } = useDappStaking();
  const { currentBlock } = useApi();

  return (
    <div>
      Era <b>{protocolState?.era}</b>, period{" "}
      <b>{protocolState?.periodInfo.number}</b>, subperiod{" "}
      <b>{protocolState?.periodInfo.subperiod}</b>, next era block{" "}
      <b>{protocolState?.nextEraStart}</b>, current block{" "}
      {currentBlock?.toString()}
    </div>
  );
};

export default memo(ProtocolState);
