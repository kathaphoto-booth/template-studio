import { test, expect } from '@playwright/test';

test.describe('CalendarPicker', () => {
  test('renders the calendar and handles blocked dates correctly', async ({ page }) => {
    await page.goto('/test-calendar');

    // Calendar component should be visible
    const calendar = page.getByTestId('calendar-picker');
    await expect(calendar).toBeVisible();

    // The mock blocked dates are: 2026-06-25, 2026-06-28, 2026-07-04, 2026-07-15
    const blockedDate25 = page.getByTestId('date-2026-06-25');
    await expect(blockedDate25).toBeDisabled();

    const blockedDate28 = page.getByTestId('date-2026-06-28');
    await expect(blockedDate28).toBeDisabled();

    // Select an unblocked date
    const availableDate = page.getByTestId('date-2026-06-26');
    await expect(availableDate).toBeEnabled();
    
    // Check initial state of the confirm button
    const confirmButton = page.getByRole('button', { name: /confirm/i });
    await expect(confirmButton).toBeDisabled();

    // Click available date
    await availableDate.click();

    // Confirm button should now be enabled
    await expect(confirmButton).toBeEnabled();
    
    // We should see the text update
    await expect(calendar).toContainText('Selected: 2026-06-26');
  });
});
