"use server"

export async function submitInquiry(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const venue = formData.get('venue');

  if (!name || !email || !venue) {
    return { success: false, message: 'All fields are required.' };
  }

  // Simulate server delay for pending state
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true, message: 'Inquiry submitted successfully.' };
}
