const FloatingBlobsBackground = ({ variant = "default" }: { variant?: "default" | "inverted" | "subtle" }) => {
  if (variant === "subtle") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle floating blobs */}
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-gradient-to-br from-primary/12 to-primary/4 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[15%] right-[10%] w-[250px] h-[250px] bg-gradient-to-tl from-secondary/15 to-secondary/5 rounded-full blur-[70px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        <div className="absolute top-[50%] right-[30%] w-[180px] h-[180px] bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      </div>
    );
  }

  if (variant === "inverted") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Inverted floating blobs - amber dominant */}
        <div className="absolute top-[5%] right-[10%] w-[400px] h-[400px] bg-gradient-to-bl from-secondary/20 via-secondary/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-gradient-to-tr from-primary/15 via-primary/8 to-transparent rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] bg-gradient-to-r from-secondary/12 to-primary/12 rounded-full blur-[70px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-[150px] h-[150px] bg-gradient-to-t from-secondary/10 to-transparent rounded-full blur-[50px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '3s' }} />
        
        {/* Glassmorphism overlay accents */}
        <div className="absolute top-[20%] left-[15%] w-[100px] h-[100px] bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
        <div className="absolute bottom-[25%] right-[20%] w-[60px] h-[60px] bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
      </div>
    );
  }

  // Default variant - teal dominant
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main floating blobs */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-gradient-to-br from-primary/18 via-primary/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] bg-gradient-to-tl from-secondary/20 via-secondary/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      <div className="absolute top-[25%] right-[20%] w-[200px] h-[200px] bg-gradient-to-b from-secondary/12 to-transparent rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '3s' }} />
      <div className="absolute bottom-[30%] left-[20%] w-[180px] h-[180px] bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-[50px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '4s' }} />
      
      {/* Glassmorphism accent circles */}
      <div className="absolute top-[15%] right-[30%] w-[80px] h-[80px] bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
      <div className="absolute bottom-[20%] left-[25%] w-[50px] h-[50px] bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
      <div className="absolute top-[60%] right-[15%] w-[40px] h-[40px] bg-white/5 backdrop-blur-sm rounded-full border border-white/10" />
    </div>
  );
};

export default FloatingBlobsBackground;
