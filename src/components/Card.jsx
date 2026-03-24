export default function Card({ title, value, subtitle, trend, icon, children, className = "" }) {
  if (children) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-500 text-xs sm:text-sm font-medium">{title}</h3>
        {icon && (
          <div className="text-gray-400 text-lg sm:text-xl">
            {icon}
          </div>
        )}
      </div>
      
      {/* Value */}
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">
        {value}
      </p>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
      
      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center mt-2">
          <span className={`text-xs font-medium ${
            trend.type === 'up' ? 'text-green-600' : 
            trend.type === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend.type === 'up' ? '↑' : trend.type === 'down' ? '↓' : '→'} {trend.value}
          </span>
          <span className="text-xs text-gray-500 ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
