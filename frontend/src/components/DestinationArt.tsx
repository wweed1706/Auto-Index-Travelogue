import { useId } from "react";
export default function DestinationArt({
  variant = "forest",
  className = "",
}: {
  variant?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const sea = variant === "sea";
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={id} x2="0" y2="1">
          <stop stopColor={sea ? "#dff1f4" : "#edf3ee"} />
          <stop offset="1" stopColor={sea ? "#c5e2e7" : "#d1e4d7"} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx="303" cy="66" r="27" fill="#f7ecd3" />
      <path
        d={
          sea
            ? "M0 130 Q70 110 135 134 T260 131 T400 129 V240 H0Z"
            : "M0 169 L95 66 L195 167 L256 102 L400 180 V240 H0Z"
        }
        fill={sea ? "#a3d0d8" : "#a8c6b5"}
      />
      <path
        d={
          sea
            ? "M0 167 Q85 148 168 171 T400 158 V240 H0Z"
            : "M0 215 L120 135 L247 217 L345 132 L400 171 V240 H0Z"
        }
        fill={sea ? "#79b2c1" : "#7caa95"}
      />
      <path
        d={
          sea
            ? "M0 219 Q95 197 183 220 T400 206 V240 H0Z"
            : "M0 240 Q120 194 203 226 T400 213 V240Z"
        }
        fill={sea ? "#4e879d" : "#568774"}
      />
      <path
        d="M0 222 Q100 180 190 197 T400 194"
        stroke="#fff"
        strokeOpacity=".35"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
