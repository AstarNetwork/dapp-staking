import { memo, useEffect, useState } from "react";
import { DAPP_ADDRESS } from "@/configuration/constants";
import { useApi } from "@/hooks/useApi";
import {
  type Dapp as DappModel,
  getDappDetails,
} from "@astar-network/dapp-staking-v3";
import Dapp from "../Dapp/Dapp";

const Dapps = () => {
  const [dApp, setDapp] = useState<DappModel>();
  const { api } = useApi();

  useEffect(() => {
    const fetchDapp = async () => {
      const dApp = await getDappDetails(DAPP_ADDRESS);
      setDapp(dApp);
    };

    if (api) {
      fetchDapp();
    }
  }, [api]);

  return <>{dApp ? <Dapp dApp={dApp} /> : <div>dApp not found</div>}</>;
};

export default memo(Dapps);
