import { ArrowRight } from "lucide-react";

export default function ArrowRightButton({
  onClick = () => {},
}: {
  onClick?: () => void;
}) {
  return (
    <button className="inputButton" onClick={onClick}>
      <ArrowRight color="white" size={18} className="inputButtonSVG" />
    </button>
  );
}
