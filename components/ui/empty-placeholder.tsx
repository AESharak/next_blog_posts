import { ReactNode } from "react";

interface EmptyPlaceholderProps {
  children: ReactNode;
  className?: string;
}

export function EmptyPlaceholder({
  children,
  className,
}: EmptyPlaceholderProps) {
  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50 ${
        className ?? ""
      }`}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps {
  children: ReactNode;
  className?: string;
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  children,
  className,
}: EmptyPlaceholderIconProps) {
  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-full bg-muted ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};

interface EmptyPlaceholderTitleProps {
  children: ReactNode;
  className?: string;
}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  children,
  className,
}: EmptyPlaceholderTitleProps) {
  return (
    <h2 className={`mt-6 text-xl font-semibold ${className ?? ""}`}>
      {children}
    </h2>
  );
};

interface EmptyPlaceholderDescriptionProps {
  children: ReactNode;
  className?: string;
}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  children,
  className,
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={`mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground ${
        className ?? ""
      }`}
    >
      {children}
    </p>
  );
};

interface EmptyPlaceholderActionProps {
  children: ReactNode;
  className?: string;
}

EmptyPlaceholder.Action = function EmptyPlaceholderAction({
  children,
  className,
}: EmptyPlaceholderActionProps) {
  return <div className={className}>{children}</div>;
};
