import { useCallback } from "react";
import { useState } from "react";

import Table from "./Table";

export enum EBUTTON_ACTIVE {
  OWNED = "owned",
  ONGOING = "published",
  COMPLETED = "completed",
}

const Content = () => {
  const [buttonActive, setButtonActive] = useState(EBUTTON_ACTIVE.OWNED);

  const handleButtonActive = useCallback((type: EBUTTON_ACTIVE) => {
    return () => setButtonActive(type);
  }, []);

  return (
    <>
      <div>
        <div className="btn-group">
          <button
            className={`btn ${
              buttonActive === EBUTTON_ACTIVE.OWNED && "btn-active"
            }`}
            onClick={handleButtonActive(EBUTTON_ACTIVE.OWNED)}
          >
            Your Draft Item
          </button>
          <button
            className={`btn ${
              buttonActive === EBUTTON_ACTIVE.ONGOING && "btn-active"
            }`}
            onClick={handleButtonActive(EBUTTON_ACTIVE.ONGOING)}
          >
            Ongoing
          </button>
          <button
            className={`btn ${
              buttonActive === EBUTTON_ACTIVE.COMPLETED && "btn-active"
            }`}
            onClick={handleButtonActive(EBUTTON_ACTIVE.COMPLETED)}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="mt-10">
        <Table type={buttonActive} />
      </div>
    </>
  );
};

export default Content;
