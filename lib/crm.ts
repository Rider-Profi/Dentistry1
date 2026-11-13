import type { BookingPayload } from "@/lib/booking-payload";

export interface CrmAdapter {
  createLead(booking: BookingPayload): Promise<{ id: string }>;
}

export class AmoCrmAdapter implements CrmAdapter {
  private baseUrl = process.env.CRM_API_URL?.replace(/\/$/, "");
  private token = process.env.CRM_API_TOKEN;

  private async request(path: string, init?: RequestInit) {
    if (!this.baseUrl || !this.token) throw new Error("AmoCRM is not configured");
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...init?.headers
      }
    });
    if (!response.ok) throw new Error(`AmoCRM ${response.status}: ${await response.text()}`);
    return response.status === 204 ? null : response.json();
  }

  async createLead(booking: BookingPayload) {
    const bookingToken = `site-booking-${booking.id}`;
    const duplicate = await this.request(`/api/v4/leads?query=${encodeURIComponent(bookingToken)}`);
    const existingLead = duplicate?._embedded?.leads?.[0];
    if (existingLead) return { id: String(existingLead.id) };

    const contacts = await this.request(`/api/v4/contacts?query=${encodeURIComponent(booking.normalizedPhone)}`);
    let contactId = contacts?._embedded?.contacts?.[0]?.id;
    if (!contactId) {
      const created = await this.request("/api/v4/contacts", {
        method: "POST",
        body: JSON.stringify([{
          name: booking.name,
          custom_fields_values: [{
            field_code: "PHONE",
            values: [{ value: booking.phone, enum_code: "WORK" }]
          }]
        }])
      });
      contactId = created?._embedded?.contacts?.[0]?.id;
    }

    const responsible = Number(process.env.CRM_RESPONSIBLE_USER_ID || 0) || undefined;
    const lead = await this.request("/api/v4/leads", {
      method: "POST",
      body: JSON.stringify([{
        name: `[${bookingToken}] ${booking.serviceName}`,
        responsible_user_id: responsible,
        tags_to_add: [{ name: "Website" }],
        _embedded: { contacts: contactId ? [{ id: contactId }] : [] }
      }])
    });
    const id = lead?._embedded?.leads?.[0]?.id;
    if (!id) throw new Error("AmoCRM did not return a lead id");

    await this.request(`/api/v4/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify([{
        note_type: "common",
        params: {
          text: [
            `Source: ${booking.source}`,
            `Treatment: ${booking.serviceName}`,
            `Dentist: ${booking.doctorName}`,
            `Preferred date: ${booking.date}`,
            `Preferred time: ${booking.time}`,
            booking.comment ? `Note: ${booking.comment}` : ""
          ].filter(Boolean).join("\n")
        }
      }])
    });
    return { id: String(id) };
  }
}

export function getCrmAdapter(): CrmAdapter {
  if (process.env.CRM_TYPE && process.env.CRM_TYPE !== "amocrm") {
    throw new Error(`CRM adapter ${process.env.CRM_TYPE} is not implemented`);
  }
  return new AmoCrmAdapter();
}
