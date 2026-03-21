const ATTENDANCE_STORAGE_PREFIX = "attendance_records";

export const getTodayAttendanceDate = () => new Date().toISOString().split("T")[0];

export const formatAttendanceDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const getUserAttendanceKey = (user) => {
  const identifier = user?.id || user?.employee_id || user?.email || user?.username || "guest";
  return `${ATTENDANCE_STORAGE_PREFIX}:${identifier}`;
};

export const getStoredAttendance = (user) => {
  if (!user) return [];

  try {
    const storedData = localStorage.getItem(getUserAttendanceKey(user));
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Failed to parse attendance records:", error);
    return [];
  }
};

export const saveStoredAttendance = (user, records) => {
  if (!user) return;
  localStorage.setItem(getUserAttendanceKey(user), JSON.stringify(records));
};

export const hasMarkedAttendanceToday = (user) => {
  const today = getTodayAttendanceDate();
  return getStoredAttendance(user).some((record) => record.date === today);
};

export const getTodayAttendanceRecord = (user) => {
  const today = getTodayAttendanceDate();
  return getStoredAttendance(user).find((record) => record.date === today) || null;
};

export const markAttendanceForToday = (user) => {
  if (!user) {
    throw new Error("User session not found");
  }

  const today = getTodayAttendanceDate();
  const existingRecords = getStoredAttendance(user);

  if (existingRecords.some((record) => record.date === today)) {
    throw new Error("Attendance has already been marked for today");
  }

  const timestamp = new Date().toISOString();
  const newRecord = {
    date: today,
    status: "Present",
    checkInTime: timestamp,
  };

  const updatedRecords = [newRecord, ...existingRecords];
  saveStoredAttendance(user, updatedRecords);
  return newRecord;
};
