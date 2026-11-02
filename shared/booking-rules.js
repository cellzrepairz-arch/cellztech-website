// One calendar policy shared by the browser and server. Never use the visitor's timezone.
export const STORE_TIME_ZONE = 'America/Chicago';
export const MIN_NOTICE_MINUTES = 30;
export const MAX_BOOKING_DAYS = 60;
const clock = new Intl.DateTimeFormat('en-CA', {
  timeZone: STORE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
});
export function chicagoNow(now = Date.now()) {
  const parts = Object.fromEntries(clock.formatToParts(new Date(now)).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}
export function parseCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y,m,d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y,m-1,d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m-1 && date.getUTCDate() === d ? date : null;
}
export function lastBookingDate(now = Date.now()) {
  const date = parseCalendarDate(chicagoNow(now).date);
  date.setUTCDate(date.getUTCDate() + MAX_BOOKING_DAYS);
  return date.toISOString().slice(0,10);
}
export function timeLabel(value) {
  if (!/^\d{2}:\d{2}$/.test(value || '')) return '';
  const [h,m] = value.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
export function windowLabel(value) {
  if (!value) return '';
  const [h,m] = value.split(':').map(Number); const end = h*60+m+30;
  return `${timeLabel(value)} - ${timeLabel(`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`)}`;
}
export function bookingSlots(value, now = Date.now()) {
  const date = parseCalendarDate(value); const today = chicagoNow(now);
  if (!date || value < today.date || value > lastBookingDate(now) || date.getUTCDay() === 0) return [];
  const close = date.getUTCDay() === 6 ? 15*60 : 19*60; const slots = [];
  for (let minute=11*60; minute <= close-30; minute+=30) {
    if (value === today.date && minute < today.minutes + MIN_NOTICE_MINUTES) continue;
    const time = `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
    slots.push({value:time, label:windowLabel(time)});
  }
  return slots;
}
export function validPhone(value) {
  return typeof value === 'string' && /^[+\d\s().-]+$/.test(value) && value.replace(/\D/g,'').length >= 10 && value.replace(/\D/g,'').length <= 15;
}
export function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@<>,;\\"]+@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(value.trim());
}
export function validateRepairRequest(body, now = Date.now()) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {code:'invalid_body', message:'Please submit a valid repair request.'};
  const limits = {device:120,model:160,issue:160,name:120,phone:32,email:254,requestedDate:10,requestedTime:5};
  for (const [key,max] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max)
      return {code:'invalid_fields',message:'Please complete the device, issue and contact details.'};
  }
  if (!validEmail(body.email) || !validPhone(body.phone)) return {code:'invalid_contact',message:'Please enter a valid email and phone number.'};
  if (!bookingSlots(body.requestedDate,now).some(slot=>slot.value===body.requestedTime))
    return {code:'invalid_window',message:'Please choose a future drop-off window during Chicago store hours, at least 30 minutes from now.'};
  for (const [key,max] of Object.entries({series:160,notes:3000,source:200})) {
    if (body[key] !== undefined && (typeof body[key] !== 'string' || body[key].length > max)) return {code:'invalid_fields',message:'Please shorten your notes and try again.'};
  }
  if (body.website !== undefined && body.website !== '') return {code:'invalid_fields',message:'Unable to accept this request.'};
  return null;
}
