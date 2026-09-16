export type LoadingScreenVariant = "page" | "outlet";

interface LoadingScreenProps {
  variant?: LoadingScreenVariant;
  label?: string;
}

const VARIANT_STYLES: Record<
  LoadingScreenVariant,
  { wrapper: string; spinner: string }
> = {
  page: {
    wrapper: "min-h-screen w-full bg-slate-50",
    spinner: "size-30 border-[10px]",
  },
  outlet: {
    wrapper: "min-h-[80vh] w-full",
    spinner: "size-20 border-[5px]",
  },
};

const LoadingScreen = ({ variant = "page", label }: LoadingScreenProps) => {
  const { wrapper, spinner } = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${wrapper}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`animate-spin motion-reduce:animate-none rounded-full border-slate-200 border-t-slate-900 ${spinner}`}
      />
      {label ? <p className="text-sm text-slate-500">{label}</p> : null}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingScreen;
