import { useState, useEffect } from "react";

const STATUS_FLOW = [
  "pending",
  "packed",
  "dispatched",
  "out-for-delivery",
  "delivered",
];

export default function OrderStatusSelector({
  currentStatus,
  onUpdate,
  isUpdateStatusLoading,
  orderItem,
}) {
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [hasUserChangedStatus, setHasUserChangedStatus] = useState(false);

  useEffect(() => {
    setLocalStatus(currentStatus); // Sync with prop
    setHasUserChangedStatus(false); // Reset user change flag
  }, [currentStatus]);

  const currentIndex = STATUS_FLOW.indexOf(localStatus);

  const isFinalStatus = localStatus === "delivered" || localStatus === "cancelled";
  const isInitiallyFinal = currentStatus === "delivered" || currentStatus === "cancelled";
const isLocalFinal = localStatus === "delivered" || localStatus === "cancelled";

  const nextStatuses = STATUS_FLOW.slice(STATUS_FLOW.indexOf(currentStatus) + 1);

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    setHasUserChangedStatus(true);
  };

  const handleSubmit = () => {
    onUpdate(orderItem.id, localStatus);
  };

  const shouldDisableSelect =
    isInitiallyFinal && !hasUserChangedStatus;

  return (
    <div className="p-4 rounded-lg shadow-md border border-gray-200 bg-white w-full max-w-sm">
      <p className="text-lg font-semibold text-gray-700 mb-2">Update Status</p>

      

<select
  value={localStatus}
  onChange={handleChange}
  disabled={isInitiallyFinal && !hasUserChangedStatus}
  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <option value={localStatus} disabled>
    {localStatus.toUpperCase()}
  </option>
  {nextStatuses.map((next) => (
    <option key={next} value={next}>
      {next.charAt(0).toUpperCase() + next.slice(1)}
    </option>
  ))}
  {localStatus !== "cancelled" && (
    <option value="cancelled">Cancelled</option>
  )}
</select>

<button
  onClick={handleSubmit}
  className="mt-3 py-2 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white w-full"
  disabled={
    (isInitiallyFinal && !hasUserChangedStatus) ||
    isUpdateStatusLoading?.id === orderItem.id
  }
>
  {isUpdateStatusLoading?.isTrue && isUpdateStatusLoading?.id === orderItem.id ? (
    <div className="w-full flex justify-center">
      <div className="w-6 h-6 rounded-full border border-t-transparent border-white animate-spin"></div>
    </div>
  ) : (
    "Submit"
  )}
</button>

    </div>
  );
}
