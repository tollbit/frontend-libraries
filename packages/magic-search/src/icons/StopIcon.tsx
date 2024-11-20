export default function StopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#D4D4D8"
      stroke="#D4D4D8"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="inherit" />
      <rect x="8" y="8" width="8" height="8" rx="1" fill="#fff" />
    </svg>
  );
}
