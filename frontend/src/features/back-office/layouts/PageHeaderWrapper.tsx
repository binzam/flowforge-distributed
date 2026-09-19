import { type ReactNode } from "react";

const PageHeaderWrapper = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`sticky top-0 bg-white px-4 md:px-6 lg:px-8 py-2 border-b border-yellow-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageHeaderWrapper;
