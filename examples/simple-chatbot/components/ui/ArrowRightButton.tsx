import { ArrowRight } from "lucide-react";

export default function ArrowRightButton({
  onClick = () => {},
  className,
}: {
  onClick?: () => void;
  className: string;
}) {
  return (
    <button className={`w-5 h-5 rounded-full ${className}`} onClick={onClick}>
      <ArrowRight color="white" size={18} className="ml-[1px]" />
    </button>
  );
}
