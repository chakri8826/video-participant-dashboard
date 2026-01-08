import { cn } from '../../utils/cn';

export function Avatar({ className, ...props }) {
  return (
    <div
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, src, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn('bg-muted flex h-full w-full items-center justify-center rounded-full text-sm font-medium', className)}
      {...props}
    >
      {children}
    </div>
  );
}

