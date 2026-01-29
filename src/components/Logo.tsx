import bbsLogo from "@/assets/bbs-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-12",
    md: "h-16",
    lg: "h-24",
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