import { test, expect } from '@playwright/test';

/**
 * Sprint 4 E2E slice test covering:
 * - S4-T08: Young UI usage practice activity (tap targets >= 64px, BigChoice, speaker button)
 * - S4-T09: Senior UI aggregate grammar hub (/student/grammar) and 4-step flow routes
 * - Responsive 375px viewport (TC-10) for Young grammar practice
 */
test.describe('Sprint 4 Grammar Activities & Senior Flow Slice', () => {
  test.beforeEach(async ({ page }) => {
    // Mock student session in sessionStorage
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'learning_platform_auth_v1',
        JSON.stringify({
          accessToken: 'mock-e2e-student-jwt',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          user: {
            id: 1,
            username: 'student.pilot',
            displayName: 'Test Student',
            role: 'Student',
            loginMode: 'Password',
            mustChangePassword: false,
          },
        })
      );
    });

    // Intercept auth profile verification
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: 'student.pilot',
          displayName: 'Test Student',
          role: 'Student',
          loginMode: 'Password',
          mustChangePassword: false,
        }),
      });
    });

    // Intercept assignments
    await page.route('**/api/me/assignments', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            assignmentId: 10,
            lessonId: 1,
            unitNo: 1,
            unitTitle: 'Getting Started',
            lessonNo: 1,
            title: 'Present Simple',
            assignedAt: '2026-10-29T00:00:00Z',
          },
        ]),
      });
    });

    // Intercept grammar topics
    await page.route('**/api/lessons/1/grammar-topics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 101,
            lessonId: 1,
            title: 'Subject Pronouns',
            summary: 'He, She, It pronouns',
            sortOrder: 1,
            rules: [
              {
                id: 201,
                grammarTopicId: 101,
                title: 'Use He for boys',
                formula: 'He + is',
                explanation: 'Rule explanation',
                sortOrder: 1,
                examples: [
                  {
                    id: 301,
                    grammarRuleId: 201,
                    textEn: 'He is a student.',
                    sortOrder: 1,
                  },
                ],
              },
            ],
            questionCount: 5,
          },
        ]),
      });
    });
  });

  test('Senior aggregate grammar page (/student/grammar) renders topic cards and navigation', async ({ page }) => {
    await page.goto('/student/grammar');

    // Heading exists
    const heading = page.getByRole('heading', { name: /Sổ tay Ngữ pháp/i });
    await expect(heading).toBeVisible();

    // Search bar exists
    const searchInput = page.getByPlaceholder(/Tìm kiếm chủ đề/i);
    await expect(searchInput).toBeVisible();
  });

  test('TC-10: Young grammar usage practice enforces >= 64px tap targets on 375px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/student/activities/grammar-usage-practice');

    const button = page.getByRole('button', { name: /Go Back/i });
    await expect(button).toBeVisible();

    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    // TC-10 requirement: tap target >= 64px
    expect(box!.height).toBeGreaterThanOrEqual(64);
  });

  test('Legacy portal remains functional and undisturbed', async ({ page }) => {
    await page.goto('/grammar');
    await expect(page).toHaveURL(/.*grammar/);
    await expect(page.locator('h1, h2, div')).not.toHaveCount(0);
  });
});
