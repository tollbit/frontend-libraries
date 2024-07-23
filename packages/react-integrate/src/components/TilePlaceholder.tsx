import { Card } from "../ui/card";
export default function TilePlaceholder({}) {
  return (
    <div className="spinny-gradient-box rounded-lg drop-shadow-md ">
      <Card className="h-96 bg-gray-100 flex items-center">
        <img
          src="/ddhq.png"
          height={50}
          width={300}
          className="opacity-50 mx-auto animate-bounce"
          alt=""
        />
      </Card>
    </div>
  );
}
