import VirtualDialogueTree from "../components/VirtualDialogueTree";
import Playback from "../components/Playback";
import { DialogueBank, DialogueLine } from "../types";

interface MainViewProps {
  dialogueBanks: DialogueBank[];
  currentlyPlayingDialogue: DialogueLine | undefined;
  playlist: DialogueLine[];
}

export default function MainView(props: MainViewProps) {
  const { dialogueBanks, currentlyPlayingDialogue, playlist } = props;

  return (
    <div className="App">
      <div className="Main">
        <VirtualDialogueTree dialogueBanks={dialogueBanks} />
      </div>

      <div className="Playback">
        <Playback
          currentlyPlayingDialogue={currentlyPlayingDialogue}
          playlist={playlist}
        />
      </div>
    </div>
  );
}
