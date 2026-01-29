import bbsLogo from "@/assets/bbs-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  return (
    <a href="/" className={`flex items-center ${className}`}>
      <img
        src={bbsLogo}
        alt="BBS Consulting Group"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </a>
  );
};

export default Logo;