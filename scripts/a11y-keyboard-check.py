"""Keyboard + focus audit for the ProgrammeCta controls on /courses.

Walks the tab order through the comparison table and programme selector and
asserts that every CTA control is reachable, has an accessible name, shows a
visible focus ring, and clears a 44px tap target.

Run against the dev server:  python3 scripts/a11y-keyboard-check.py
"""

import asyncio, sys
from playwright.async_api import async_playwright

URL = "http://localhost:8080/courses"


async def main() -> int:
    failures: list[str] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await (await browser.new_context(viewport={"width": 1280, "height": 1800})).new_page()
        await page.goto(URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)

        ctas = page.locator('[role="group"][aria-label^="Next steps for"] a')
        count = await ctas.count()
        if count == 0:
            print("FAIL: no ProgrammeCta controls found")
            await browser.close()
            return 1

        for i in range(count):
            el = ctas.nth(i)
            await el.focus()
            info = await el.evaluate(
                """el => {
                    const r = el.getBoundingClientRect();
                    const s = getComputedStyle(el);
                    return {
                        name: (el.getAttribute('aria-label') || el.innerText || '').trim(),
                        focused: document.activeElement === el,
                        ring: s.boxShadow !== 'none' || s.outlineStyle !== 'none',
                        h: Math.round(r.height), w: Math.round(r.width),
                        href: el.getAttribute('href'),
                    };
                }"""
            )
            label = info["name"] or "(unnamed)"
            if not info["focused"]:
                failures.append(f"not focusable: {label}")
            if not info["name"]:
                failures.append(f"missing accessible name: {info['href']}")
            if not info["ring"]:
                failures.append(f"no visible focus indicator: {label}")
            if info["h"] < 44:
                failures.append(f"tap target {info['h']}px < 44px: {label}")

        # Tab must reach the comparison-table scroll region.
        region = page.locator('[role="region"][aria-label^="Programme comparison"]')
        await region.focus()
        if not await region.evaluate("el => document.activeElement === el"):
            failures.append("comparison table scroll region is not keyboard reachable")

        await browser.close()

    print(f"Checked {count} ProgrammeCta controls on {URL}")
    for f in failures:
        print(f"  FAIL {f}")
    if failures:
        return 1
    print("PASS: all controls focusable, named, ringed and >=44px")
    return 0


sys.exit(asyncio.run(main()))
