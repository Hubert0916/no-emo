export function getCalendarMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekIndex = firstDayOfMonth.getDay();
  const weeks = [];
  let currentDayCounter = 1 - firstDayWeekIndex;

  for (let row = 0; row < 6; row++) {
    const weekRow = [];
    for (let col = 0; col < 7; col++) {
      const dt = new Date(year, month, currentDayCounter);
      weekRow.push({
        year: dt.getFullYear(),
        month: dt.getMonth(),
        day: dt.getDate(),
        isCurrentMonth: dt.getMonth() === month,
        dateString: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`,
      });
      currentDayCounter++;
    }
    weeks.push(weekRow);
  }

  return weeks;
}
