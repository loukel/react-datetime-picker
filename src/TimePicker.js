import { useEffect, useState } from 'react';
import { today, time, getMinutes, turnInto24Hour } from './dtFunctions';

/**
 * Generates all the times available to be selected
 * @param {string} minTime
 * @param {string} maxTime
 * @param {number} step
 * @param {[[string,string]]} unavailableTimes 2D array
 * @returns {[]} array of all available times
 */
const generateTimes = (
  minTime = '00:00',
  maxTime = '23:59',
  step = 15,
  unavailableTimes = []
) => {
  var minTimeMins = getMinutes(minTime);
  var maxTimeMins = getMinutes(maxTime);

  var times = [];

  // Convert unavailable times into minutes
  var unavailableTimesMins = unavailableTimes.map(([start, end]) => {
    var startMins = getMinutes(start);
    var endMins = getMinutes(end);
    return [startMins, endMins];
  });

  // Does the step start from the min date or from the hour of the min date? -> maybe its okay for now but an option in the future?
  for (
    var time = minTimeMins - (minTimeMins % 60);
    time <= maxTimeMins;
    time += step
  ) {
    if (time < minTimeMins) continue;
    var unavailable = false;
    // Check if the time is within an unavaliable timeframe
    unavailableTimesMins.forEach(([start, end]) => {
      if (time >= start && time <= end) unavailable = true;
    });
    // If it is available add the time to the times available
    if (!unavailable) times.push(turnInto24Hour(time));
  }

  return times;
};

const TimePicker = ({
  selectedDate,
  allUnavailableDateTimes,
  minMaxDayTimes,
  step,
  passSelectedTime,
}) => {
  /**
   * 24 hr time to store
   * min and max time is defined based off what day it is
   */
  // var minTime = '09:00';
  // var maxTime = '20:30';

  // var unavailableTimes = [['12:00', '14:00'], ['16:00', '16:30']];

  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const formattedSelectedDate = new Date(selectedDate);
    var dayIndex = formattedSelectedDate.getDay();
    var minTime = minMaxDayTimes[dayIndex][0];
    var maxTime = minMaxDayTimes[dayIndex][1];

    // Check the selected date is today
    // - This should be done in Datetime, props should be more minimal, most calculations should be done in parent as the min time addition could change the day and also this could
    if (
      formattedSelectedDate.valueOf() === today().valueOf() &&
      minMaxDayTimes[7].slice(0, 3) === 'now'
    ) {
      var addedMins = 0;
      if (minMaxDayTimes[7].slice(3)) {
        addedMins = parseInt(minMaxDayTimes[7].slice(4));
        if (minMaxDayTimes[7].slice(3, 4) == '-') addedMins = -addedMins;
      }
      var minTimeInMins = getMinutes(time()) + addedMins;
      minTime = turnInto24Hour(minTimeInMins);
    }

    var unavailableTimes = allUnavailableDateTimes[selectedDate];

    setTimes(generateTimes(minTime, maxTime, step, unavailableTimes));
  }, [selectedDate]);

  useEffect(() => {
    if (times.length == 0) {
      setSelectedTime(-1);
    } else {
      setSelectedTime(times[0]);
      passSelectedTime(times[0]);
      // ^ ugly time transfer
    }
  }, [times]);

  return (
    <div className='card times d-flex '>
      <input
        type='time'
        value={selectedTime}
        name='time-input'
        id='time-input'
        className='d-none'
        readOnly
      />
      {times.length > 0 &&
        times.map((time) => (
          <button
            type='button'
            key={time}
            className='btn btn-secondary'
            onClick={() => {
              setSelectedTime(time);
              passSelectedTime(time);
            }}
            disabled={time == selectedTime && true}
          >
            {time}
          </button>
        ))}
      {times.length === 0 && (
        <div className='text-center pt-4'>No Available Times</div>
      )}
    </div>
  );
};

export default TimePicker;
