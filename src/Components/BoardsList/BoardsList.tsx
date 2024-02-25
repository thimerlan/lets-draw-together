import { useEffect, useState } from "react";
import { boardsDB } from "../../../firebaseConfig";
import { onValue, ref } from "firebase/database";

import "./BoardsList.scss";

interface BoardData {
  boardID: string;
}

interface IBoardsListProps {
  setSelectedBoardID: (value: string) => void;
}
const BoardsList = ({ setSelectedBoardID }: IBoardsListProps) => {
  const [boardsList, setBoardsList] = useState<Record<string, BoardData>>({});

  useEffect(() => {
    const boardsListRef = ref(boardsDB, "boardsList");
    onValue(boardsListRef, (snapshot) => {
      const boardsList = snapshot.val();
      if (boardsList) {
        setBoardsList(boardsList);
      } else {
        console.log("Boards List not found");
      }
    });
  }, []);

  const joinBoard = (boardID: string) => {
    const nickname = window.prompt("Please enter your nickname:");
    if (nickname !== null && nickname.trim() !== "") {
      setSelectedBoardID(boardID);
    } else {
      alert("You must enter a nickname to join the board.");
    }
  };

  return (
    <section className="createdBoards-list">
      <div className="boardsList-container">
        {Object.values(boardsList).map((board, index) => (
          <div key={board.boardID} className="board__card">
            <h4>Board number:</h4>
            <b>{index + 1}</b>
            <br />
            <button onClick={() => joinBoard(board.boardID)}>join</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BoardsList;
