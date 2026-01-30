import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-muted/50 to-background pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>
            <div className="flex gap-4 pt-6">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          {/* Image */}
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
