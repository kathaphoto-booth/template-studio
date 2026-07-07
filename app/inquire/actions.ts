"use server";

export async function submitLeadAction(formData: FormData) {
  const payload = {
    client_name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
    client_email: formData.get("email") as string,
    client_phone: formData.get("phone") as string,
    event_date: formData.get("eventDate") as string,
    event_type: formData.get("eventType") as string,
    venue: formData.get("location") as string,
    selected_package: formData.get("selectedPackage") as string,
  };

  try {
    const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || `HTTP error! status: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, leadHash: data.lead_hash };
  } catch (error: any) {
    console.error("Submission failed:", error);
    return { success: false, error: "Network failure. Please try again." };
  }
}
