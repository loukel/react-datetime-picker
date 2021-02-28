/**
 * Get the day name of the first day. E.g. The first day of Feb 2021 starts on a Monday -> returns 1
 * @param {number} year The year in the format YYYY
 * @param {number} month The month in the format MM
 * @return {number} The index of the day name
 * @indexes 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
 */
function firstDayOfMonth(year, month) {
  /**
   * @params
   * year -> YYYY
   * month -> MM
   */
  var date = new Date(year, month, 1);

  return date.getDay();
  // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // return days[date.getDay()];
}

/**
 * Get the total number of days in a month
 * @param {number} year The year in the format YYYY
 * @param {number} month The month in the format MM
 * @return {number} The total number of days
 */
function totalDaysInMonth(year, month) {
  var dt = new Date(year, month);
  var monthString = dt.getMonth() + 1;
  var yearString = dt.getFullYear();
  var daysInMonth = new Date(yearString, monthString, 0).getDate();

  return daysInMonth;
}

/**
 * Get the months calender
 * @param {number} yearIndex The year in the format YYYY
 * @param {number} monthIndex The month in the format MM
 * @returns 2D Array, first index-> day name (index), second index -> row of calender
 */
function getMonthsCal(yearIndex, monthIndex) {
  const daysInMonth = totalDaysInMonth(yearIndex, monthIndex);
  const firstDay = firstDayOfMonth(yearIndex, monthIndex);

  let monthsCalender = [];
  let row = [];

  // Start the month's calender with the final days of the previous month
  const daysInPrevMonth = totalDaysInMonth(yearIndex, monthIndex - 1);
  var prevDaysStart = daysInPrevMonth - (firstDay - 1);
  var i = 0;
  while (i < firstDay) {
    row[i] = prevDaysStart;
    prevDaysStart++;
    i++;
  }

  let dayIndex = firstDay;

  // Fill in the calender with the months actual days
  for (var dateDay = 1; dateDay <= daysInMonth; dateDay++) {
    row[dayIndex] = dateDay;
    if (dayIndex === 6) {
      // Every Saturday, start a new row, starting with Sunday
      dayIndex = 0;
      monthsCalender.push(row);
      // If this is the last loop, another row will not be created
      if (dateDay !== daysInMonth) row = [];
    } else {
      dayIndex++;
    }
  }

  // Fill in the elements at the end
  if (row.length !== 7) {
    var y = 1;
    for (var j = row.length; j <= 6; j++) {
      row[j] = y++;
    }
    monthsCalender.push(row);
    // month's calender complete
  }

  return monthsCalender;
}

/**
 * converts number into 2 char string
 * @param {number} num 1
 * @returns {string} '01'
 */
function numberToTwoChar(num) {
  if (typeof num == 'string') {
    return num;
  }
  var text = String(num < 10 ? '0' : '') + num;
  return text;
}

const today = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
};

const time = () => {
  const d = new Date();
  return [
    numberToTwoChar(d.getHours()),
    numberToTwoChar(d.getMinutes()),
    numberToTwoChar(d.getSeconds()),
  ].join(':');
};

/**
 * Input a time in the 24 hour format and receive the number minutes since the previous day (12am)
 * @param {string} hoursMinutes '09:20'
 */
const getMinutes = (hoursMinutes) => {
  var hour = parseInt(hoursMinutes.split(':')[0]);
  var minute = parseInt(hoursMinutes.split(':')[1]);
  var minutes = hour * 60 + minute;
  return minutes;
};

/**
 * converts minutes into the 24 hour time format
 * @param {number} minutes
 */
const turnInto24Hour = (minutes) => {
  var hour = Math.floor(minutes / 60);
  var minute = minutes % 60;

  hour = numberToTwoChar(hour);
  minute = numberToTwoChar(minute);

  return `${hour}:${minute}`;
};

function timeConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

export {
  getMonthsCal,
  numberToTwoChar,
  today,
  time,
  getMinutes,
  turnInto24Hour,
  timeConvert,
};
