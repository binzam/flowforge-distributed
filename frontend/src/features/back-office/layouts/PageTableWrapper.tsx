import type { ReactNode } from "react";

const PageTableWrapper = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`p-4 flex-1  md:p-6 lg:p-8 ${className}`}>{children}</div>;
};

export default PageTableWrapper;
