import VirtualDialogueTree from "../components/VirtualDialogueTree";
import Playback from "../components/Playback";
import { DialogueBank } from "../types";

interface MainViewProps {
  dialogueBanks: DialogueBank[];
}

export default function MainView(props: MainViewProps) {
  const { dialogueBanks } = props;

  return (
    <div className="App">
      <div className="Main">
        <VirtualDialogueTree dialogueBanks={dialogueBanks} />
      </div>

      <div className="Playback">
        <Playback lines={[]} />
      </div>
    </div>
  );
}
