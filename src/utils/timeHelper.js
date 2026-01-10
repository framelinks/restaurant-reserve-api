/**
 * Time Helper Utilities
 * Handles time parsing, validation, and business logic for reservations
 */

/**
 * Parse time string (HH:MM) to minutes since midnight
 * @param {string} timeString - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  /**
   * Convert minutes since midnight to HH:MM format
   * @param {number} minutes - Minutes since midnight
   * @returns {string} Time in HH:MM format
   */
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
  
  /**
   * Check if a time is within operating hours
   * @param {Date} datetime - The datetime to check
   * @param {string} opensAt - Opening time (HH:MM)
   * @param {string} closesAt - Closing time (HH:MM)
   * @returns {boolean} True if within operating hours
   */
  function isWithinOperatingHours(datetime, opensAt, closesAt) {
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    const openMinutes = timeToMinutes(opensAt);
    const closeMinutes = timeToMinutes(closesAt);
    
    return timeInMinutes >= openMinutes && timeInMinutes < closeMinutes;
  }
  
  /**
   * Check if reservation end time is within operating hours
   * @param {Date} endTime - The end datetime to check
   * @param {string} closesAt - Closing time (HH:MM)
   * @returns {boolean} True if end time is before closing
   */
  function isEndTimeValid(endTime, closesAt) {
    const hours = endTime.getHours();
    const minutes = endTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    const closeMinutes = timeToMinutes(closesAt);
    
    return timeInMinutes <= closeMinutes;
  }
  
  /**
   * Check if two time ranges overlap
   * @param {Date} start1 - Start of first range
   * @param {Date} end1 - End of first range
   * @param {Date} start2 - Start of second range
   * @param {Date} end2 - End of second range
   * @returns {boolean} True if ranges overlap
   */
  function timeRangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && end1 > start2;
  }
  
  /**
   * Add minutes to a date
   * @param {Date} date - The base date
   * @param {number} minutes - Minutes to add
   * @returns {Date} New date with minutes added
   */
  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  
  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Parse date string to Date object
   * @param {string} dateString - Date string (YYYY-MM-DD or ISO)
   * @returns {Date} Parsed date
   */
  function parseDate(dateString) {
    return new Date(dateString);
  }
  
  /**
   * Check if a date is today
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is today
   */
  function isToday(date) {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  }
  
  /**
   * Check if a date is in the future
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is in the future
   */
  function isFuture(date) {
    return date > new Date();
  }
  
  /**
   * Get start and end of day for a given date
   * @param {string} dateString - Date string (YYYY-MM-DD)
   * @returns {Object} Object with startOfDay and endOfDay
   */
  function getDayBounds(dateString) {
    const date = new Date(dateString);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    return { startOfDay, endOfDay };
  }
  
  /**
   * Generate time slots for a given date and operating hours
   * @param {string} dateString - Date string (YYYY-MM-DD)
   * @param {string} opensAt - Opening time (HH:MM)
   * @param {string} closesAt - Closing time (HH:MM)
   * @param {number} slotDuration - Duration of each slot in minutes (default: 30)
   * @returns {Array} Array of time slot objects
   */
  function generateTimeSlots(dateString, opensAt, closesAt, slotDuration = 30) {
    const slots = [];
    const date = new Date(dateString);
    
    const openMinutes = timeToMinutes(opensAt);
    const closeMinutes = timeToMinutes(closesAt);
    
    for (let minutes = openMinutes; minutes < closeMinutes; minutes += slotDuration) {
      const slotTime = minutesToTime(minutes);
      const [hours, mins] = slotTime.split(':').map(Number);
      
      const slotDate = new Date(date);
      slotDate.setHours(hours, mins, 0, 0);
      
      slots.push({
        time: slotTime,
        datetime: slotDate,
        available: true
      });
    }
    
    return slots;
  }
  
  module.exports = {
    timeToMinutes,
    minutesToTime,
    isWithinOperatingHours,
    isEndTimeValid,
    timeRangesOverlap,
    addMinutes,
    formatDate,
    parseDate,
    isToday,
    isFuture,
    getDayBounds,
    generateTimeSlots
  };