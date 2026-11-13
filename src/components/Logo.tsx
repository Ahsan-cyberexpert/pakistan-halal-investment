import { useId } from "react";

type Props = { variant?: "mark" | "full"; dark?: boolean; className?: string };

export default function Logo({ variant = "full", dark = false, className }: Props) {
  const id = useId().replace(/:/g, "");
  const full = variant === "full";
  const [g1, g2] = dark ? ["#6FDDB9", "#2FAF86"] : ["#2E8B57", "#0E4A2A"];
  const [y1, y2] = dark ? ["#F2D27A", "#CF9A33"] : ["#EBC96C", "#C58F2B"];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={full ? "235 40 790 330" : "235 50 340 315"}
      className={className}
      role="img"
      aria-label="Roziq"
    >
      <defs>
        <linearGradient id={`g${id}`} gradientUnits="userSpaceOnUse" x1="260" y1="60" x2="545" y2="350">
          <stop offset="0" stopColor={g1} />
          <stop offset="1" stopColor={g2} />
        </linearGradient>
        <linearGradient id={`y${id}`} gradientUnits="userSpaceOnUse" x1="400" y1="165" x2="270" y2="345">
          <stop offset="0" stopColor={y1} />
          <stop offset="1" stopColor={y2} />
        </linearGradient>
      </defs>
      <path fill={`url(#g${id})`} d="M252 65H478C520 66 557 100 558 148C560 200 530 240 470 259L544 351H479L465 346L393 271L407 235L412 200H454C478 197 489 178 488 153C487 136 475 126 454 125H348C318 124 280 110 252 65Z" />
      <path fill={`url(#y${id})`} d="M407 162C362 170 303 198 279 244C266 270 265 312 266 347C296 335 352 312 378 274C397 247 404 205 407 162Z" />
      <path fill="none" stroke="#FFF3D1" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" d="M376 200C340 228 304 266 284 316" />
      {full && (
        <text x="600" y="262" fontFamily="var(--font-figtree), Figtree, Arial, sans-serif" fontSize="150" fontWeight="700" letterSpacing="-2" fill={dark ? "#EAF2EE" : "#0E4A2A"}>
          Roziq
        </text>
      )}
    </svg>
  );
}
