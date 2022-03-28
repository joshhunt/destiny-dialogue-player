interface Props {
  level: number;
}

export default function Indent({ level }: Props) {
  return (
    <span
      className="Indent"
      style={{
        height: 12,
        verticalAlign: "middle",
        display: "inline-block",
        fontSize: 0,
        lineHeight: 1,
        background: "transparent",
        opacity: 0.5,
        width: level * 16,
      }}
    >
      {level}
    </span>
  );
}
