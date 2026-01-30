const GradientMeshBackground = ({ variant = "default" }: { variant?: "default" | "inverted" | "subtle" }) => {
  if (variant === "subtle") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle flowing gradient */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-gradient-to-tl from-secondary/10 via-secondary/5 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>
      </div>
    );
  }

  if (variant === "inverted") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Flowing wave gradients - inverted colors */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-gradient-to-bl from-secondary/15 via-secondary/8 to-transparent rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-tr from-primary/12 via-primary/6 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-secondary/8 to-primary/8 rounded-full blur-[80px]" />
        </div>
        
        {/* Mesh-like wave pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,400 C360,300 720,500 1080,400 C1260,350 1380,450 1440,400" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
          <path d="M0,500 C360,400 720,600 1080,500 C1260,450 1380,550 1440,500" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
          <path d="M0,300 C360,200 720,400 1080,300 C1260,250 1380,350 1440,300" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
        </svg>
      </div>
    );
  }

  // Default variant
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Flowing wave gradients */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] bg-gradient-to-tl from-secondary/12 via-secondary/6 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-primary/6 to-secondary/6 rounded-full blur-[80px]" />
      </div>
      
      {/* Mesh-like wave pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 1440 800">
        <path d="M0,400 C360,300 720,500 1080,400 C1260,350 1380,450 1440,400" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
        <path d="M0,500 C360,400 720,600 1080,500 C1260,450 1380,550 1440,500" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
        <path d="M0,300 C360,200 720,400 1080,300 C1260,250 1380,350 1440,300" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
      </svg>
    </div>
  );
};

export default GradientMeshBackground;
