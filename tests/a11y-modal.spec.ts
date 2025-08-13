import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Modal accessibility', () => {

  test('modal meets WCAG 2.0/2.1 A/AA', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Avaa modaali
    await page.getByTestId('chocolate-cake').getByTestId('view-button').click();

    // Varmista että dialogi on auki
    const dialog = page.getByRole('dialog');

    // Aja axe vain modaalin sisällölle
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])         // rajaa tarkistukset
      .include(['[role="dialog"]', '.dqpl-modal', '.RecipeModal'])  // kohdenna analyysi modaliin
      // .disableRules(['color-contrast'])     // esimerkki: jos haluat väliaikaisesti ohittaa jonkun säännön
      .analyze();

    // Raportoi viat selkeästi
    if (results.violations.length) {
      console.log('A11y violations in modal:\n');
      for (const v of results.violations) {
        console.log(`- ${v.id} (${v.impact}) — ${v.help}`);
        v.nodes.forEach((n, i) => {
          console.log(`  ${i + 1}) ${n.target.join(' ')}`);
          if (n.failureSummary) console.log(`     ${n.failureSummary}`);
        });
      }
    }

    // Failaa testi, jos virheitä
    expect(results.violations, 'Modal should have no a11y violations').toEqual([]);
  });
});

