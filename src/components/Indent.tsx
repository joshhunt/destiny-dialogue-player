interface Props {
  level: number;
}

export default function Indent({ level }: Props) {
  return <span className="Indent" style={{ width: level * 16 }} />;
}
