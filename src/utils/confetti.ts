/**
 * Lightweight canvas-based confetti burst.
 * No dependencies required.
 */
const confetti = () => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "hsl(174, 62%, 47%)", // primary/teal
    "hsl(36, 90%, 55%)",  // secondary/gold
    "hsl(174, 62%, 70%)", // lighter teal
    "hsl(36, 90%, 75%)",  // lighter gold
    "hsl(0, 0%, 95%)",    // white-ish
  ];

  const pieces: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }[] = [];

  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2 - 100,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 120;

  const animate = () => {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.x += p.vx;
      p.vy += 0.3; // gravity
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - frame / maxFrames);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(animate);
};

export default confetti;
