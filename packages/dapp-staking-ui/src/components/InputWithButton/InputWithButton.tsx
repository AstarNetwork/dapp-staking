import { memo, useState } from "react";
import styles from "./InputWithButton.module.css";
import { tokenToWei } from "@astar-network/dapp-staking-v3/utils";

type InputWithButtonProps = {
  buttonText: string;
  onAmountChange?: (amount: bigint) => void;
  onButtonClick?: (amount: bigint) => void;
  validateAmount?: (amount: bigint) => Promise<[boolean, string]>;
};

const InputWithButton = ({
  buttonText,
  onAmountChange,
  onButtonClick,
  validateAmount,
}: InputWithButtonProps) => {
  const [amount, setAmount] = useState<bigint>(0n);
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const stakeAmountInWei = tokenToWei(Number(event.target.value));

    setAmount(stakeAmountInWei);
    onAmountChange?.(stakeAmountInWei);

    let valid = true;
    let message = "";
    if (validateAmount) {
      [valid, message] = await validateAmount(stakeAmountInWei);
      setIsValid(valid);
      setValidationMessage(message);
    }
  };

  return (
    <div>
      <div className={styles.components}>
        <input
          type="number"
          min={0}
          placeholder="0"
          onChange={handleAmountChange}
        />
        <button
          type="button"
          disabled={!isValid}
          onClick={() => onButtonClick?.(amount)}
          className={styles.button}
        >
          {buttonText}
        </button>
      </div>
      <div>{validationMessage}</div>
    </div>
  );
};

export default memo(InputWithButton);
