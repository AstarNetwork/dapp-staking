import { memo, useEffect, useState } from "react";
import { DAPP_ADDRESS } from "@/configuration/constants";
import { useApi } from "@/hooks";
import {
  type Dapp as DappModel,
  getDappDetails,
} from "@astar-network/dapp-staking-v3";
import Dapp from "../Dapp/Dapp";
import StakingInfo from "../StakingInfo/StakingInfo";
import styles from "./Dapps.module.css";

const Dapps = () => {
  const { api } = useApi();
  const [dApp, setDapp] = useState<DappModel>();

  useEffect(() => {
    const fetchDapp = async () => {
      const dApp = await getDappDetails(DAPP_ADDRESS);
      setDapp(dApp);
    };

    if (api) {
      fetchDapp();
    }
  }, [api]);

  return (
    <div className={styles.container}>
      {dApp ? <Dapp dApp={dApp} /> : <div>dApp not found</div>}
      <StakingInfo dappAddress={DAPP_ADDRESS} />
    </div>
  );
};

export default memo(Dapps);
