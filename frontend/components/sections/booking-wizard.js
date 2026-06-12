"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/services/catalog-service";
import { bookingService } from "@/services/booking-service";
import { serviceCategories } from "@/constants/services";

const steps = ["Vehicle", "Service", "Date", "Time", "Customer", "Payment", "Confirm"];
const vehicleTypes = ["Sedan", "Coupe", "SUV", "Crossover", "Pickup"];
const paymentMethods = ["Cash", "Stripe"];

function getDateOptions() {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return date.toISOString().slice(0, 10);
  });
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotLoading, setSlotLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [booking, setBooking] = useState({
    vehicleType: "Sedan",
    serviceId: null,
    date: getDateOptions()[0],
    slotId: null,
    customer: {
      name: "",
      phone: "",
      email: ""
    },
    paymentMethod: "Cash"
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (booking.serviceId && booking.date) {
      loadAvailableSlots();
    }
  }, [booking.serviceId, booking.date]);

  async function loadServices() {
    try {
      setLoading(true);
      const response = await catalogService.listServices();
      const apiServices = response.data || [];
      if (apiServices.length) {
        setServices(apiServices);
        setBooking((prev) => ({ ...prev, serviceId: apiServices[0].id }));
      } else {
        const fallback = serviceCategories.flatMap((category) =>
          category.items.map((item) => ({
            ...item,
            id: item.slug,
            categoryName: category.name
          }))
        );
        setServices(fallback);
        if (fallback.length) {
          setBooking((prev) => ({ ...prev, serviceId: fallback[0].id }));
        }
      }
    } catch (err) {
      setError("Unable to load services");
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableSlots() {
    try {
      setSlotLoading(true);
      const response = await bookingService.getAvailability({
        serviceId: booking.serviceId,
        date: booking.date
      });
      const availableSlots = response.data || [];
      setSlots(availableSlots);
      
      const uniqueTimes = [...new Set(availableSlots.map((s) => s.startsAt?.substring(11, 16)))].filter(Boolean);
      setTimeSlots(uniqueTimes.length ? uniqueTimes : ["09:00", "11:30", "14:00", "16:30"]);
      
      if (availableSlots.length && !booking.slotId) {
        setBooking((prev) => ({ ...prev, slotId: availableSlots[0].id }));
      }
    } catch (err) {
      setTimeSlots(["09:00", "11:30", "14:00", "16:30"]);
    } finally {
      setSlotLoading(false);
    }
  }

  function updateBooking(key, value) {
    setBooking((current) => ({
      ...current,
      [key]: value
    }));
    if (key === "serviceId" || key === "date") {
      setBooking((current) => ({ ...current, slotId: null }));
    }
  }

  function updateCustomer(key, value) {
    setBooking((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [key]: value
      }
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const selectedService = services.find((s) => s.id === booking.serviceId);
      if (!selectedService) throw new Error("Service not selected");
      if (!booking.customer.name) throw new Error("Please enter your name");
      if (!booking.customer.phone) throw new Error("Please enter your phone");

      const payload = {
        serviceId: booking.serviceId,
        vehicleType: booking.vehicleType,
        slotId: booking.slotId || undefined,
        startsAt: new Date(`${booking.date}T${timeSlots[0]}`).toISOString(),
        customerInfo: {
          name: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email
        }
      };

      const response = await bookingService.createBooking(payload);
      setResult(response);
      setBooking({
        vehicleType: "Sedan",
        serviceId: services[0]?.id || null,
        date: getDateOptions()[0],
        slotId: null,
        customer: { name: "", phone: "", email: "" },
        paymentMethod: "Cash"
      });
      setStep(0);
    } catch (err) {
      setError(err.message || "Unable to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = services.find((service) => service.id === booking.serviceId);

  return (
    <div className="glass-panel mt-10 rounded-lg p-6">
      {result ? (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-6">
          <p className="font-semibold text-emerald-300">Booking confirmed!</p>
          <p className="mt-2 text-sm text-emerald-200">Booking code: {result.bookingCode}</p>
          <Button className="mt-4" onClick={() => setResult(null)}>
            Make another booking
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-7">
            {steps.map((label, index) => (
              <button
                key={label}
                className={`rounded-md border px-3 py-3 text-sm transition ${
                  index === step ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5 text-muted"
                }`}
                onClick={() => setStep(index)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-8 rounded-md border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-accent">Step {step + 1}</p>
            <h2 className="mt-3 text-2xl font-semibold">{steps[step]}</h2>

            {loading && step === 1 ? (
              <p className="mt-6 text-muted">Loading services...</p>
            ) : null}

            {step === 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {vehicleTypes.map((type) => (
                  <button
                    key={type}
                    className={`rounded-md border px-4 py-4 text-sm ${
                      booking.vehicleType === type ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5"
                    }`}
                    onClick={() => updateBooking("vehicleType", type)}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {services.length ? (
                  services.map((service) => (
                    <button
                      key={service.id}
                      className={`rounded-md border p-4 text-left ${
                        booking.serviceId === service.id ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5"
                      }`}
                      onClick={() => updateBooking("serviceId", service.id)}
                      type="button"
                    >
                      <span className="block text-sm opacity-70">{service.category || service.categoryName || "Service"}</span>
                      <span className="mt-1 block font-semibold">{service.name}</span>
                      <span className="mt-2 block text-sm opacity-70">{service.duration || `${service.durationMin || 60} min`}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-muted">No services available</p>
                )}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {getDateOptions().map((date) => (
                  <button
                    key={date}
                    className={`rounded-md border px-4 py-4 text-sm ${
                      booking.date === date ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5"
                    }`}
                    onClick={() => updateBooking("date", date)}
                    type="button"
                  >
                    {date}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mt-6">
                {slotLoading ? (
                  <p className="text-muted">Loading available times...</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {timeSlots.length ? (
                      timeSlots.map((time) => (
                        <button
                          key={time}
                          className="rounded-md border border-white/10 bg-white/5 px-4 py-4 text-sm"
                          type="button"
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className="text-muted">No times available for this date</p>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <input
                  className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
                  placeholder="Name"
                  value={booking.customer.name}
                  onChange={(event) => updateCustomer("name", event.target.value)}
                />
                <input
                  className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
                  placeholder="Phone"
                  value={booking.customer.phone}
                  onChange={(event) => updateCustomer("phone", event.target.value)}
                />
                <input
                  className="rounded-md border border-white/10 bg-black/40 px-4 py-3"
                  placeholder="Email"
                  value={booking.customer.email}
                  onChange={(event) => updateCustomer("email", event.target.value)}
                />
              </div>
            ) : null}

            {step === 5 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    className={`rounded-md border px-4 py-4 text-sm ${
                      booking.paymentMethod === method ? "border-accent bg-accent text-black" : "border-white/10 bg-white/5"
                    }`}
                    onClick={() => updateBooking("paymentMethod", method)}
                    type="button"
                  >
                    {method}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 6 ? (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
                  <p>Vehicle: {booking.vehicleType}</p>
                  <p>Service: {selectedService?.name || "Not selected"}</p>
                  <p>Date: {booking.date}</p>
                  <p>Customer: {booking.customer.name || "Not entered"}</p>
                  <p>Phone: {booking.customer.phone || "Not entered"}</p>
                  <p>Email: {booking.customer.email || "Not provided"}</p>
                </div>
                {error ? (
                  <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
              Back
            </Button>
            {step === steps.length - 1 ? (
              <Button disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Confirming..." : "Confirm Booking"}
              </Button>
            ) : (
              <Button disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>
                Next
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
