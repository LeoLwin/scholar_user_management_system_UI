import toast, { Toast } from "react-hot-toast";
import {
  CheckLineIcon,
  CloseIcon,
} from '../../../icons';

type ToastType = "success" | "error" | "warning" | "info";

const Notification = (type: ToastType, title: string, message: string) => {

  const config = {
    success: { text: "text-green-500", icon: <CheckLineIcon/> },
    error: { text: "text-red-500", icon: <CloseIcon/> },
    warning: { text: "text-yellow-500", icon: "⚠" },
    info: { text: "text-blue-500", icon: "i"}
  }[type];

  toast.custom((t: Toast) => (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-md w-full  dark:border-gray-700 dark:bg-gray-800 bg-gray-100 dark:text-white/90 text-primary shadow-lg rounded-lg border-1 border-gray-200 flex`}
    >
      <div className="flex-1 w-0 p-4 flex items-start">
        {/* Icon */}
        <div className={`${config.text} flex-shrink-0 pt-0.5 flex items-center justify-center h-10 w-10 dark:bg-gray-500 bg-white rounded-full font-bold`}>
          {config.icon}
        </div>

        {/* Text */}
        <div className="ml-3 flex-1">
          <p className={`text-sm ${config.text} font-semibold`}>{title}</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>

      {/* Close button */}
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full  p-4 flex items-center justify-center text-sm font-medium hover:text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

export default Notification;
