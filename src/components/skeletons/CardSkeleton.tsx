import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  hasImage?: boolean;
  lines?: number;
}

const CardSkeleton = ({ hasImage = true, lines = 3 }: CardSkeletonProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {hasImage && (
        <Skeleton className="mb-4 h-48 w-full rounded-xl" />
      )}
      <Skeleton className="mb-3 h-6 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="mb-2 h-4" 
          style={{ width: `${85 - i * 15}%` }} 
        />
      ))}
      <Skeleton className="mt-4 h-10 w-32" />
    </div>
  );
};

export default CardSkeleton;
