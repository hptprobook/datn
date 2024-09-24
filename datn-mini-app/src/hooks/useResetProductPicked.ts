import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import {
  initialProductInfoPickedState,
  productInfoPickedState,
} from "../state"; // Adjust the import path if necessary

const useResetProductPicked = () => {
  const setProductPicked = useSetRecoilState(productInfoPickedState);

  const resetProductPicked = useCallback(() => {
    setProductPicked(initialProductInfoPickedState);
  }, [setProductPicked]);

  return resetProductPicked;
};

export default useResetProductPicked;