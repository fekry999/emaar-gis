// CameraIcon: small CCTV camera drawn as SVG, rotated by `rot` degrees.
export default function CameraIcon({ rot }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
      <path
        d="M3 7h12a2 2 0 0 1 2 2v1l4-2v8l-4-2v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        fill="#fbf6e9" stroke="#1b1036" strokeWidth="1.2" strokeLinejoin="round"
      />
      <circle className="cam-led" cx="5.5" cy="10.5" r="1.7" fill="#e24b4a" />
    </svg>
  );
}
