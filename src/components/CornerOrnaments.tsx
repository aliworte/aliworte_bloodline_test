interface CornerOrnamentsProps {
  opacity?: number;
}

export default function CornerOrnaments({ opacity = 0.6 }: CornerOrnamentsProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10" style={{ opacity }}>
      {/* Top-left corner */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        className="absolute top-0 left-0 w-40 h-40 md:w-56 md:h-56"
        style={{ transform: 'none' }}
      />
      {/* Top-right corner */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56"
        style={{ transform: 'scaleX(-1)' }}
      />
      {/* Bottom-left corner */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        className="absolute bottom-0 left-0 w-40 h-40 md:w-56 md:h-56"
        style={{ transform: 'scaleY(-1)' }}
      />
      {/* Bottom-right corner */}
      <img
        src="/images/corner-ornament.png"
        alt=""
        className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56"
        style={{ transform: 'scaleX(-1) scaleY(-1)' }}
      />
    </div>
  );
}
