import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={`bg-white/5 animate-pulse rounded-sm ${className}`} 
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};

export const MusicCardSkeleton = () => {
  return (
    <div className="flex items-center gap-6 p-4 border border-white/5 bg-white/[0.02]">
      <Skeleton className="w-16 h-16 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-1/4 h-3" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  );
};

export const HeroCardSkeleton = () => {
  return (
    <div className="w-full aspect-[4/5] md:aspect-square bg-surface border border-white/5 p-8 flex flex-col justify-end gap-6">
      <Skeleton className="w-2/3 h-12" />
      <div className="flex gap-4">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="w-full h-14" />
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="bg-surface/30 border border-border-subtle p-6 rounded-sm flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Skeleton className="w-20 h-20" />
        <div className="flex flex-col gap-3">
          <Skeleton className="w-48 h-8" />
          <div className="flex gap-4">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="w-12 h-12" />
        <Skeleton className="w-12 h-12" />
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div className="grid grid-cols-[280px_1fr] gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="flex flex-col gap-8">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </div>
      </div>
      <Skeleton className="w-full h-20" />
    </div>
  );
};
