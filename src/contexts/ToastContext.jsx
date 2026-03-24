import { createContext, useContext, useMemo } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { toast as notify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const value = useMemo(
    () => ({
      success: (message, options = {}) => showCustomToast("success", message, options),
      error: (message, options = {}) => showCustomToast("error", message, options),
      info: (message, options = {}) => showCustomToast("info", message, options),
      warning: (message, options = {}) => showCustomToast("warning", message, options),
      dismiss: (id) => notify.dismiss(id),
      promise: (promise, messages, options = {}) => notify.promise(promise, messages, options),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={false}
        toastClassName={() => "p-0"}
        bodyClassName={() => "p-0"}
        progressClassName={() => "bg-slate-900"}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function showCustomToast(type, message, options) {
  const iconMap = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo,
    warning: FiAlertCircle,
  };

  const toneMap = {
    success: {
      ring: "ring-emerald-200",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100 text-emerald-700",
      title: "Success",
      progress: "bg-emerald-500",
    },
    error: {
      ring: "ring-red-200",
      bg: "bg-red-50",
      iconBg: "bg-red-100 text-red-700",
      title: "Error",
      progress: "bg-red-500",
    },
    info: {
      ring: "ring-blue-200",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100 text-blue-700",
      title: "Info",
      progress: "bg-blue-500",
    },
    warning: {
      ring: "ring-amber-200",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100 text-amber-700",
      title: "Warning",
      progress: "bg-amber-500",
    },
  };

  const tone = toneMap[type] || toneMap.info;
  const Icon = iconMap[type] || FiInfo;

  return notify(
    ({ closeToast }) => (
      <div className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ${tone.ring} ${tone.bg}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{tone.title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600">{String(message)}</p>
        </div>
        <button
          type="button"
          onClick={closeToast}
          className="rounded-full p-1 text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
          aria-label="Close toast"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    ),
    {
      ...options,
      className: "shadow-none bg-transparent",
      icon: false,
      closeButton: false,
      progressClassName: tone.progress,
    }
  );
}
