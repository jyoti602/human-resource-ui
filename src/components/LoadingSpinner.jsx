export default function LoadingSpinner({ size = "medium", text = "Loading..." }) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-green-600`}></div>
      <p className={`${textSizeClasses[size]} text-gray-500 font-medium`}>{text}</p>
    </div>
  );
}
