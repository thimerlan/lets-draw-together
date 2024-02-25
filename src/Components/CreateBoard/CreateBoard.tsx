import { child, ref, set } from "firebase/database";
import { boardsDB } from "../../../firebaseConfig";

import "./CreateBoard.scss";

const CreateBoard = () => {
  function generateRandomId() {
    const timestamp = new Date().getTime();

    const randomString = Math.random().toString(36).substring(2, 8);

    const uniqueId = timestamp + randomString;

    return uniqueId;
  }

  const handleCreateBoard = async (): Promise<void> => {
    try {
      const uniqueBoardId = generateRandomId();

      if (uniqueBoardId) {
        const boardsListRef = ref(boardsDB, "boardsList");

        await set(child(boardsListRef, uniqueBoardId), {
          boardID: uniqueBoardId,
        });
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="create-board">
      <div className="create-board-button bn39">
        <button className="bn39btn" onClick={handleCreateBoard}>
          Create a board
        </button>
      </div>
    </div>
  );
};

export default CreateBoard;
