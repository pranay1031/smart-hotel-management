import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

// ─── EmailJS Config ────────────────────────────────────────────
const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_BOOKING = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING;
const TEMPLATE_SERVICE = import.meta.env.VITE_EMAILJS_TEMPLATE_SERVICE;
const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ─── In-App Notification Store (always works) ─────────────────
// Simple event emitter so any component can listen for new notifications
const listeners = [];
export const onInAppNotification = (fn) => { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); };
const emitInApp = (title, body, type = 'info') => listeners.forEach(fn => fn({ title, body, type, time: new Date() }));

// ─── Guaranteed Notification (in-app toast + desktop if available) ─────
export const notify = async (title, body, type = 'booking') => {
  // 1. Always fire an in-app toast (guaranteed to work, no permissions needed)
  const icons = { booking: '🏨', food: '🍽️', service: '🔧', info: '🔔' };
  const icon = icons[type] || '🔔';
  toast(`${icon} ${title} — ${body}`, {
    duration: 6000,
    style: {
      background: '#1e293b',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: 380,
      fontSize: 14,
    },
  });

  // 2. Emit in-app event for notification center
  emitInApp(title, body, type);

  // 3. Try desktop notification as a bonus
  await sendDesktopNotification(title, body);
};

// ─── Desktop Notification Permission ─────────────────────────
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// ─── Desktop Notification ─────────────────────────────────────
export const sendDesktopNotification = async (title, body, icon = '/favicon.svg') => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) return;
  }
  try {
    // Direct Notification API — works on localhost
    const n = new Notification(title, { body, icon, tag: 'smart-hotel-' + Date.now() });
    n.onerror = (e) => console.warn('Notification error:', e);
  } catch (err) {
    console.warn('Desktop notification failed (OS may have blocked):', err);
  }
};

// ─── Email: Booking Confirmation ──────────────────────────────
export const sendBookingEmail = async ({ guestEmail, guestName, bookingId, roomName, checkIn, checkOut, totalPrice, guests }) => {
  if (!SERVICE_ID || SERVICE_ID === 'your_service_id') {
    console.warn('EmailJS not configured – skipping email.');
    return;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_BOOKING, {
      to_email: guestEmail, to_name: guestName,
      booking_id: bookingId, room_name: roomName,
      check_in: checkIn, check_out: checkOut,
      total_price: `₹${totalPrice}`, guests,
      hotel_name: 'Smart Hotel – Novotel Vizag',
    }, PUBLIC_KEY);
    console.log('Booking email sent ✓');
  } catch (err) {
    console.error('EmailJS booking error:', err);
  }
};

// ─── Email: Service Request Confirmation ──────────────────────
export const sendServiceEmail = async ({ guestEmail, guestName, incidentId, serviceType, priority, description }) => {
  if (!SERVICE_ID || SERVICE_ID === 'your_service_id') {
    console.warn('EmailJS not configured – skipping email.');
    return;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_SERVICE, {
      to_email: guestEmail, to_name: guestName,
      incident_id: incidentId, service_type: serviceType,
      priority, description,
      hotel_name: 'Smart Hotel – Novotel Vizag',
    }, PUBLIC_KEY);
    console.log('Service email sent ✓');
  } catch (err) {
    console.error('EmailJS service error:', err);
  }
};
