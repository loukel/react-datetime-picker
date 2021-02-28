import { useEffect, useState } from 'react';
import TimePicker from './TimePicker';
import {
  getMinutes,
  getMonthsCal,
  numberToTwoChar,
  time,
  today,
  timeConvert,
} from './dtFunctions';

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the months and years between two dates
 * @param {string} minDate in the format YYYY-MM-DD
 * @param {string} maxDate in the format YYYY-MM-DD
 * @returns {array} array of months and years
 */
function dateRange(minDate, maxDate) {
  var start = minDate.split('-');
  var end = maxDate.split('-');
  var startYear = parseInt(start[0]);
  var endYear = parseInt(end[0]);
  var dates = [];

  for (var i = startYear; i <= endYear; i++) {
    var endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
    var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
    for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      var month = j + 1;
      var displayMonth = month < 10 ? '0' + month : month;
      dates.push([i, displayMonth].join('-'));
    }
  }
  return dates;
}

/**
 * date time picker
 * @param {YYYY-MM-DD' | Date | 'today±0} minDate
 * @param {YYYY-MM-DD' | Date | 'today±0} maxDate
 * @returns datetime picker
 */
const Datetime = ({ minDate, maxDate }) => {
  /**
   * min and max date
   * minmax day times
   * unavailable datetimes
   */

  const allUnavailableDateTimes = {
    '2021-02-10': [
      ['12:00', '14:00'],
      ['16:00', '16:30'],
    ],
    '2021-02-11': [
      ['14:00', '14:30'],
      ['16:00', '18:30'],
    ],
    '2021-02-12': [['09:00', '20:30']],
  };

  const minMaxDayTimes = [
    ['09:00', '20:30'], // Sunday
    ['09:00', '20:30'], // Monday
    ['09:00', '20:30'], // Tuesday
    ['09:00', '20:30'], // Wednesday
    ['09:00', '20:30'], // Thursday
    ['09:00', '20:30'], // Friday
    ['09:00', '20:30'], // Saturday
    'now', // Today
  ];

  var minTimeInMins;
  var maxTimeInMins;
  if (minMaxDayTimes[7].slice(0, 3) === 'now') {
    minTimeInMins = getMinutes(time());
    maxTimeInMins = getMinutes(minMaxDayTimes[today().getDay()][1]);
    var addedMins = 0;
    if (minMaxDayTimes[7].slice(3)) {
      addedMins = parseInt(minMaxDayTimes[7].slice(4));
      if (minMaxDayTimes[7].slice(3, 4) === '-') addedMins = -addedMins;
      minTimeInMins += addedMins;
    }
  }

  // Fixes minDate
  if (minDate.slice(0, 5) === 'today') {
    var daysToAdd = 0;
    var sign = minDate.slice(5, 6);

    if (sign === '+') daysToAdd = parseInt(minDate.slice(6));
    else if (sign === '-') daysToAdd = -parseInt(minDate.slice(6));

    if (
      daysToAdd === 0 &&
      (minTimeInMins > 1440 || minTimeInMins > maxTimeInMins)
    )
      daysToAdd++;

    var dateToChange = new Date();
    dateToChange = addDays(dateToChange, daysToAdd);
    dateToChange = [
      dateToChange.getFullYear(),
      numberToTwoChar(dateToChange.getMonth() + 1),
      numberToTwoChar(dateToChange.getDate()),
    ].join('-');
    minDate = dateToChange;
  } else if (minDate instanceof Date) {
    var unformattedDate = [
      minDate.getFullYear(),
      numberToTwoChar(minDate.getMonth() + 1),
      numberToTwoChar(minDate.getDate()),
    ].join('-');
    minDate = unformattedDate;
  }

  // Fixes maxDate
  if (maxDate === 'today') {
    var daysToAdd = 0;
    var sign = minDate.slice(5, 6);
    if (sign === '+') daysToAdd = parseInt(minDate.slice(6));
    else if (sign === '-') daysToAdd = -parseInt(minDate.slice(6));

    var dateToChange = new Date();
    addDays(dateToChange, daysToAdd);
    dateToChange = [
      dateToChange.getFullYear(),
      numberToTwoChar(dateToChange.getMonth() + 1),
      numberToTwoChar(dateToChange.getDate()),
    ].join('-');
    maxDate = dateToChange;
  } else if (maxDate instanceof Date) {
    var unformattedDate = [
      maxDate.getFullYear(),
      numberToTwoChar(maxDate.getMonth() + 1),
      numberToTwoChar(maxDate.getDate()),
    ].join('-');
    maxDate = unformattedDate;
  }

  const [selectedDate, setSelectedDate] = useState(minDate);
  const updateSelectedDate = (monthYear_ = monthYear, day_ = day) => {
    var date = [monthYear_, day_].join('-');
    if (
      monthYear_ === monthsYears[monthsYears.length - 1] &&
      day_ > maxDate.split('-')[2]
    ) {
      while (day_ > maxDate.split('-')[2]) {
        day_--;
      }
      day_ = numberToTwoChar(day_);
      date = [monthYear_, day_].join('-');
    } else if (monthYear_ === monthsYears[0] && day_ < minDate.split('-')[2]) {
      while (day_ < minDate.split('-')[2]) {
        day_++;
      }
      day_ = numberToTwoChar(day_);
      date = [monthYear_, day_].join('-');
    }

    // Check if date is invalid, and lower if so
    while (isNaN(new Date(date))) {
      day_--;
      date = [monthYear_, day_].join('-');
    }

    setSelectedDate(date);
  };

  const monthsYears = dateRange(minDate, maxDate);
  const [monthIndex, setMonthIndex] = useState(0);
  const [monthYear, setMonthYear] = useState(monthsYears[monthIndex]);

  const [day, setDay] = useState(minDate.split('-')[2]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const prevMonth = () => {
    if (monthIndex > 0) setMonthIndex(monthIndex - 1);
  };
  const nextMonth = () => {
    if (monthIndex < monthsYears.length - 1) setMonthIndex(monthIndex + 1);
  };

  function getDisplayMonthYear(unformatedMY) {
    var MY = new Date(unformatedMY);
    return monthNames[MY.getMonth()] + ' ' + MY.getFullYear();
  }

  useEffect(() => {
    setMonthYear(monthsYears[monthIndex]);
  }, [monthIndex]);

  useEffect(() => {
    updateSelectedDate();
  }, [monthYear, day]);

  // Calender
  const MY = new Date(monthYear);
  const month = getMonthsCal(MY.getFullYear(), MY.getMonth());

  const [currentCalender, setCurrentCalender] = useState([]);

  // Get date keys
  useEffect(() => {
    var monthCalender = [];
    var when = 'previous';
    month.forEach((row) => {
      var rowCalender = [];
      row.forEach((date) => {
        if (date == 1 && when === 'current')
          // Date is set the month after the current
          when = 'after';
        else if (date == 1)
          // Date is set in the current
          when = 'current';

        var daysDate;
        switch (when) {
          case 'previous':
            if (monthIndex > 0) {
              var monthString;
              var yearString;
              if (monthYear.slice(5, 7) - 1 == 0) {
                monthString = '12';
                yearString = monthYear.slice(0, 4) - 1;
              } else {
                monthString = numberToTwoChar(monthYear.slice(5, 7) - 1);
                yearString = monthYear.slice(0, 4);
              }
              daysDate = [yearString, monthString, numberToTwoChar(date)].join(
                '-'
              );
            } else daysDate = date;
            break;
          case 'current':
            var formattedDate = [monthYear, numberToTwoChar(date)].join('-');
            if (formattedDate <= maxDate && formattedDate >= minDate)
              daysDate = formattedDate;
            else daysDate = date;
            break;
          case 'after':
            if (monthIndex < monthsYears.length - 1) {
              var monthString;
              var yearString;
              if (parseInt(monthYear.slice(5, 7)) + 1 == 13) {
                monthString = '01';
                yearString = parseInt(monthYear.slice(0, 4)) + 1;
              } else {
                monthString = numberToTwoChar(
                  parseInt(monthYear.slice(5, 7)) + 1
                );
                yearString = monthYear.slice(0, 4);
              }
              if (
                [yearString, monthString, numberToTwoChar(date)].join('-') <=
                maxDate
              )
                daysDate = [
                  yearString,
                  monthString,
                  numberToTwoChar(date),
                ].join('-');
              else daysDate = date;
            } else daysDate = date;
            break;
        }
        rowCalender.push(daysDate);
      });
      monthCalender.push(rowCalender);
    });
    setCurrentCalender(monthCalender);
  }, [monthYear]);

  function selectDate(date) {
    if (typeof date == 'string' && date != selectedDate) {
      if (date.slice(0, -3) === monthYear) {
        setDay(date.slice(8, 10));
      } else {
        var newMonthYear = date.slice(0, 7);
        // If new month year is before the current -1 from the index, vice versa
        const formattedCurrentMonth = new Date(
          monthYear.slice(0, 4),
          monthYear.slice(5, 7)
        );
        const formattedNewMonth = new Date(
          newMonthYear.slice(0, 4),
          newMonthYear.slice(5, 7)
        );
        if (formattedCurrentMonth > formattedNewMonth) {
          setMonthIndex(monthIndex - 1);
        } else {
          setMonthIndex(monthIndex + 1);
        }
        setDay(date.slice(8, 10));
      }
    }
  }

  // Incredibly ugly time transfer from child to parent
  var [selectedTime, setSelectedTime] = useState('');
  const passSelectedTime = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className='datetime-picker mt-1 py-4 d-flex justify-content-center'>
      <div className='card date-picker mr-4'>
        <input
          type='datetime'
          value={selectedDate}
          className='mb-4 text-center d-none'
          name='date-input'
          id='date-input'
          readOnly
        />
        <div className='d-flex justify-content-center'>
          <button
            type='button'
            className='btn btn-default btn-arrow-left month-navigator'
            onClick={prevMonth}
          >
            Previous
          </button>
          <span className='month-year'>{getDisplayMonthYear(monthYear)}</span>
          <button
            type='button'
            className='btn btn-default btn-arrow-right month-navigator'
            onClick={nextMonth}
          >
            Next
          </button>
        </div>
        <table className='table table-bordered dates'>
          <thead>
            <tr>
              <th>
                Sun<span>day</span>
              </th>
              <th>
                Mon<span>day</span>
              </th>
              <th>
                Tue<span>sday</span>
              </th>
              <th>
                Wed<span>nesday</span>
              </th>
              <th>
                Thu<span>rday</span>
              </th>
              <th>
                Fri<span>day</span>
              </th>
              <th>
                Sat<span>urday</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentCalender.map((row) => (
              <tr key={row}>
                {row.map((date) => (
                  <th
                    key={date}
                    id={date}
                    onClick={() => selectDate(date)}
                    className={
                      new Date(date).getMonth() + 1 == monthYear.slice(5, 7) &&
                      typeof date != 'number' &&
                      new Date(
                        date.slice(0, 4),
                        date.slice(5, 7) - 1,
                        date.slice(8, 10)
                      ) <=
                        new Date(
                          maxDate.slice(0, 4),
                          maxDate.slice(5, 7) - 1,
                          maxDate.slice(8, 10)
                        )
                        ? `this-month-cell ${
                            date == selectedDate ? 'selected' : ''
                          }`
                        : ''
                    }
                  >
                    {typeof date == 'number' ? date : new Date(date).getDate()}
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TimePicker
        selectedDate={selectedDate}
        minMaxDayTimes={minMaxDayTimes}
        allUnavailableDateTimes={allUnavailableDateTimes}
        step={15}
        passSelectedTime={passSelectedTime}
      />
      <div className='h5 position-absolute datetime-display'>
        <span className='text-muted'>
          {new Date(selectedDate).toDateString()} at {timeConvert(selectedTime)}
        </span>
      </div>
    </div>
  );
};

export default Datetime;
