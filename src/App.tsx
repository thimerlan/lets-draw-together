import { useState } from "react";

import DrawingBoard from "./Components/DrawingBoard/DrawingBoard";
import CreateBoard from "./Components/CreateBoard/CreateBoard";
import BoardsList from "./Components/BoardsList/BoardsList";

import "./App.scss";

function App() {
  const [selectedBoardID, setSelectedBoardID] = useState("");

  return (
    <main>
      <div className="main-container">
        {!selectedBoardID && (
          <>
            <h1 className="main-title">!Collaborative Drawing Board!</h1>
            <p className="how-to-use">
              Welcome to the collaborative drawing board! To get started, you
              can create your own board by clicking on the "Create Board"
              button. Once created, you can draw on your board and it
              automatically saves artwork. Other users can access your board by
              clicking the board. Let your creativity flow and enjoy drawing
              together in real-time!
              <br />
              <span>Happy drawing :)</span>
            </p>
            <CreateBoard />

            <BoardsList setSelectedBoardID={setSelectedBoardID} />
          </>
        )}

        {selectedBoardID && (
          <DrawingBoard
            width={1050}
            height={620}
            selectedBoardID={selectedBoardID}
            setSelectedBoardID={setSelectedBoardID}
          />
        )}
      </div>
    </main>
  );
}

export default App;
