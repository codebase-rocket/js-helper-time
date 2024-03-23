// Info: Test Cases
'use strict';

// Shared Dependencies
var Lib = {};

// Dependencies
Lib.Utils = require('js-helper-utils');
Lib.Debug = require('js-helper-debug')(Lib);
const [ Time, TimeInput, TimeData ] = require('js-helper-time')(Lib);


////////////////////////////SIMILUTATIONS//////////////////////////////////////
 // None
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Sample Unix Time in Seconds
var time = 1577836800; // "01/01/2020 @ 12:00am (UTC)" OR "Wed, 01 Jan 2020 00:00:00 +0000"

var current_time = Lib.Utils.getUnixTime(); // In Unixtime

const timezones = [
  "America/Atka",
  "US/Aleutian",
  "US/Alaska",
  "US/Central",
  "America/Shiprock",
  "Navajo",
  "US/Mountain",
  "US/Michigan",
  "America/Indiana/Indianapolis",
  "America/Indianapolis",
  "US/East-Indiana",
  "America/Knox_IN",
  "US/Indiana-Starke",
  "America/Louisville",
  "US/Pacific",
  "US/Pacific-New",
  "US/Eastern",
  "US/Arizona",
  "Pacific/Johnston",
  "US/Hawaii",
  "America/Adak",
  "America/Anchorage",
  "America/Boise",
  "America/Chicago",
  "America/Denver",
  "America/Detroit",
  "America/Fort_Wayne",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Los_Angeles",
  "America/Menominee",
  "America/Metlakatla",
  "America/New_York",
  "America/Nome",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Phoenix",
  "America/Sitka",
  "America/Yakutat",
  "Pacific/Honolulu",
  "EST",
  "MST"
];

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////


// Test dayName() function
console.log( // Output: 'wednesday'
  "dayName(2020,1,1)", // 1 Jan 2020
  Time.dayName(2020,1,1)
);


// Test epochDay() function
var epoch_day = Time.epochDay(1,10,30);
console.log( // Output: true
  "epochDay(1,10,30)",
  epoch_day
);

// Test epochDay() function
var epoch_day = Time.epochDay('11',null,'00');
console.log( // Output: true
  "epochDay('11',null,'00')",
  epoch_day
);


// Test reverseEpochDay() function
console.log( // Output: true
  "reverseEpochDay(epoch_day)",
  Time.reverseEpochDay(epoch_day)
);


// Test validateTimezone() function
console.log( // Output: true
  "validateTimezone('America/New_York')",
  TimeInput.validateTimezone('America/New_York')
);
console.log( // Output: false
  "validateTimezone('UTC+7')",
  TimeInput.validateTimezone('UTC+7')
);


// Test validateDateRange() function

// Get Minimum Date (Current-Time minus 2 Days)
var min_date = new Date();

// Get Maximum Date (Current-Time plus 10 years)
var max_date = new Date();
max_date.setDate(3650); // Current + 10 years

console.log( // Output: true
  "validateDateRange(2025, 1, 30, min_date, max_date)",
  TimeInput.validateDateRange(2025, 1, 30, min_date, max_date)
);
console.log( // Output: false
  "validateDateRange(2020, 1, 30, min_date, max_date)",
  TimeInput.validateDateRange(2020, 1, 30, min_date, max_date)
);


// Test validateDateTimeRange() function

// Get Minimum Date
var min_date = new Date('August 19, 2022 14:30:20');

// Get Maximum Date (After few minutes)
var max_date = new Date('August 19, 2022 14:45:40');

console.log( // Output: true
  "validateDateTimeRange('2022', 8, 19, 14, 35, 10, min_date, max_date)",
  TimeInput.validateDateTimeRange('2022', 8, 19, 14, 35, 10, min_date, max_date)
);
console.log( // Output: false
  "validateDateTimeRange('2022', 8, 19, 14, 45, 41, min_date, max_date)",
  TimeInput.validateDateTimeRange('2022', 8, 19, 14, 45, 41, min_date, max_date)
);


/*
// Clean and list only valid timezones in an array
timezones.forEach(function(timezone){
  if( TimeInput.validateTimezone(timezone) )
    console.log(`"${timezone}"`)
});
*/


// Test militaryTimeToSeconds() function
console.log( // Output: 13200
  "militaryTimeToSeconds('0340')", // 3:40 AM
  Time.militaryTimeToSeconds('0340')
);


// Test formatHourMinTo12HourTime() function
console.log( // Output: 1:30 PM
  "formatHourMinTo12HourTime(13, 30)", // Hours:13, Mins:30
  Time.formatHourMinTo12HourTime(13, 30)
);
console.log( // Output: 11:05 AM
  "formatHourMinTo12HourTime(11, 5)", // Hours:11, Mins:5
  Time.formatHourMinTo12HourTime(11, 5)
);
console.log( // Output: 12:00 AM
  "formatHourMinTo12HourTime(0, 30)", // Hours:0 Midnight, Mins:30
  Time.formatHourMinTo12HourTime(0, 30)
);
console.log( // Output: 12:00 AM
  "formatHourMinTo12HourTime(24, 0)", // Hours:24 Midnight, Mins:0
  Time.formatHourMinTo12HourTime(24, 0)
);
console.log( // Output: 12:00 PM
  "formatHourMinTo12HourTime(12, 0)", // Hours:24 Midnight, Mins:0
  Time.formatHourMinTo12HourTime(12, 0)
);


// Test secondsToTimeString() function
console.log( // Output: 10 AM
  "secondsToTimeString(36000)", // 10 AM
  Time.secondsToTimeString(36000)
);
console.log( // Output: 10 PM
  "secondsToTimeString(79200)", // 10 PM
  Time.secondsToTimeString(79200)
);
console.log( // Output: 12 PM
  "secondsToTimeString(43200)", // 12 Noon
  Time.secondsToTimeString(43200)
);
console.log( // Output: 12 AM
  "secondsToTimeString(0)", // 12 Midnight
  Time.secondsToTimeString(0)
);
console.log( // Output: 10 AM
  "secondsToTimeString(122400)", // 1 Day + 10 AM
  Time.secondsToTimeString(122400)
);


// Test unixtimeToUnixDay() function
console.log( // Output: 1607385600 [8 December 2020 00:00:00 UTC]
  "unixtimeToUnixDay(1607464979)", // 8 December 2020 22:02:59 UTC
  Time.unixtimeToUnixDay(1607464979)
);


// Test getTimezoneOffset() function
console.log( // Output: ...
  "getTimezoneOffset(current_time, 'America/New_York')",
  Time.getTimezoneOffset(current_time, 'America/New_York')
);
console.log( // Output: ...
  "getTimezoneOffset(current_time, 'Australia/Sydney')",
  Time.getTimezoneOffset(current_time, 'Australia/Sydney')
);
console.log( // Output: ...
  "getTimezoneOffset('1672464801', 'America/New_York')", // Case: Midnight 12:01am till 12:59am
  Time.getTimezoneOffset('1672464801', 'America/New_York')
);


// Test unixtimeToTimezoneDate() function
console.log( // Output: ...
  "unixtimeToTimezoneDate(current_time, 'America/New_York')",
  Time.unixtimeToTimezoneDate(current_time, 'America/New_York')
);
console.log( // Output: ...
  "unixtimeToTimezoneDate(current_time, 'Australia/Sydney')",
  Time.unixtimeToTimezoneDate(current_time, 'Australia/Sydney')
);
console.log( // Output: ...
  "unixtimeToTimezoneDate(current_time, 'Asia/Kolkata')",
  Time.unixtimeToTimezoneDate(current_time, 'Asia/Kolkata')
);



// Test unixtimeToDate() function
var test_time = 1600241473;
console.log( // Output: '2020-09-16T07:31:13.000Z'
  "unixtimeToDate(test_time)",
  Time.unixtimeToDate(test_time)
);


// Test dateToUnixtime() function
var test_date = new Date('2020-09-16T07:31:13.000Z');
console.log( // Output: 1600241473
  "dateToUnixtime(test_date)",
  Time.dateToUnixtime(test_date)
);



// Test unixtimeToDateString() function
var test_time = 1600241473;
console.log( // Output: '2020-09-16T07:31:13.000Z'
  "unixtimeToDateString(test_time)",
  Time.unixtimeToDateString(test_time)
);


// Test dateStringToUnixtime() function
var test_date_str = '2020-09-16T07:31:13.000Z';
console.log( // Output: 1600241473
  "dateStringToUnixtime(test_date_str)",
  Time.dateStringToUnixtime(test_date_str)
);



// Test unixtimeToUtcString() function
var test_time = 1600241473;
console.log( // Output: 'Wed, 16 Sep 2020 07:31:13 GMT'
  "unixtimeToUtcString(test_time)",
  Time.unixtimeToUtcString(test_time)
);


// Test utcStringToUnixtime() function
var test_date_str = 'Wed, 16 Sep 2020 07:31:13 GMT';
console.log( // Output: 1600241473
  "utcStringToUnixtime(test_date_str)",
  Time.utcStringToUnixtime(test_date_str)
);



// Test dateStringToDataSet() function
var test_date_str = '2020-09-16T07:31:13.000Z';
console.log( // Output: ...
  "dateStringToDataSet(test_date_str)",
  Time.dateStringToDataSet(test_date_str)
);


// Test dateToDataSet() function
var test_date = Time.unixtimeToTimezoneDate(current_time, 'Asia/Kolkata');
console.log( // Output: ...
  "dateToDataSet(test_date)",
  Time.dateToDataSet(test_date)
);



// Test dateDataSet() function
var date_data_set = Time.dateDataSet( // 2020-08-16T09:05:00
  '2020', // year
  '08', // month
  '16', // day
  '09', // hours
  '05', // minutes
  '00' // seconds
);
console.log( // Output: ...
  "dateDataSet(date_data_set)",
  date_data_set
);


// Test dateDataSetToDate() function
console.log( // Output: 2020-08-16T09:05:00
  "dateDataSetToDate(date_data_set)",
  Time.dateDataSetToDate(date_data_set)
);


// Test dateDataSetToDateString() function
console.log( // Output: 2020-08-16T09:05:00
  "dateDataSetToDateString(date_data_set)",
  Time.dateDataSetToDateString(date_data_set)
);


// Test dateDataSetToUnixtime() function
console.log( // Output: 1597568700
  "dateDataSetToUnixtime(date_data_set)",
  Time.dateDataSetToUnixtime(date_data_set)
);


// Test getLastDayOfMonth() function
console.log( // Output: 31
  "getLastDayOfMonth(2026, 12)",
  Time.getLastDayOfMonth(2026, 12)
);



///////////////////////////////////////////////////////////////////////////////
