import ConversationCollection from "../components/ConversationCollection";
import Playback from "../components/Playback";

export default function MainView() {
  return (
    <div className="App">
      <div className="Main">
        <ConversationCollection />
      </div>

      <div className="Playback">
        <Playback lines={[]} />
      </div>
    </div>
  );
}
