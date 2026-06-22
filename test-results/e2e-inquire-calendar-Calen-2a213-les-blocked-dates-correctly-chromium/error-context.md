# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/inquire/calendar.spec.ts >> CalendarPicker >> renders the calendar and handles blocked dates correctly
- Location: tests/e2e/inquire/calendar.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByRole('button', { name: /confirm/i })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /confirm/i })

```

```yaml
- heading "Calendar Picker Test Page" [level=1]
- button "Prev"
- heading "June 2026" [level=2]
- button "Next"
- text: Sun Mon Tue Wed Thu Fri Sat
- button "1"
- button "2"
- button "3"
- button "4"
- button "5"
- button "6"
- button "7"
- button "8"
- button "9"
- button "10"
- button "11"
- button "12"
- button "13"
- button "14"
- button "15"
- button "16"
- button "17"
- button "18"
- button "19"
- button "20"
- button "21"
- button "22"
- button "23"
- button "24"
- button "25" [disabled]
- button "26"
- button "27"
- button "28" [disabled]
- button "29"
- button "30"
- text: Select your date
- alert: Calendar Picker Test Page
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('CalendarPicker', () => {
  4  |   test('renders the calendar and handles blocked dates correctly', async ({ page }) => {
  5  |     await page.goto('/test-calendar');
  6  | 
  7  |     // Calendar component should be visible
  8  |     const calendar = page.getByTestId('calendar-picker');
  9  |     await expect(calendar).toBeVisible();
  10 | 
  11 |     // The mock blocked dates are: 2026-06-25, 2026-06-28, 2026-07-04, 2026-07-15
  12 |     const blockedDate25 = page.getByTestId('date-2026-06-25');
  13 |     await expect(blockedDate25).toBeDisabled();
  14 | 
  15 |     const blockedDate28 = page.getByTestId('date-2026-06-28');
  16 |     await expect(blockedDate28).toBeDisabled();
  17 | 
  18 |     // Select an unblocked date
  19 |     const availableDate = page.getByTestId('date-2026-06-26');
  20 |     await expect(availableDate).toBeEnabled();
  21 |     
  22 |     // Check initial state of the confirm button
  23 |     const confirmButton = page.getByRole('button', { name: /confirm/i });
> 24 |     await expect(confirmButton).toBeDisabled();
     |                                 ^ Error: expect(locator).toBeDisabled() failed
  25 | 
  26 |     // Click available date
  27 |     await availableDate.click();
  28 | 
  29 |     // Confirm button should now be enabled
  30 |     await expect(confirmButton).toBeEnabled();
  31 |     
  32 |     // We should see the text update
  33 |     await expect(calendar).toContainText('Selected: 2026-06-26');
  34 |   });
  35 | });
  36 | 
```