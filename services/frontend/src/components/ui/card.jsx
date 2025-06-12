export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={
        "rounded-lg border shadow-sm p-4 bg-white dark:bg-zinc-900 " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}