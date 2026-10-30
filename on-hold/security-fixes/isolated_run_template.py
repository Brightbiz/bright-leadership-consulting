import asyncio, sys
from urllib.parse import urlparse
from playwright.async_api import async_playwright
ALLOW={"localhost","127.0.0.1"}
blocked=[]; leaked=[]
async def main():
  async with async_playwright() as p:
    # Layer 1: every non-local request goes to a unresolvable address (DNS kill switch), so it cannot leave even if routing misses it.
    b=await p.chromium.launch(headless=True, args=["--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1"])
    ctx=await b.new_context(viewport={"width":1280,"height":1800})
    # Layer 2: deny-by-default on the whole context (covers popups/new tabs, not only one page).
    async def guard(route):
      h=urlparse(route.request.url).hostname
      if h in ALLOW: return await route.continue_()
      blocked.append(route.request.method+" "+route.request.url[:80]); await route.abort()
    await ctx.route("**/*", guard)
    ctx.on("response", lambda r: leaked.append(r.url) if urlparse(r.url).hostname not in ALLOW else None)
    pg=await ctx.new_page()
    # Self-test before any form use: a direct backend call must fail, or the run stops.
    await pg.goto("http://localhost:8080/brochures/peak-performance-brochure.html")
    ok=await pg.evaluate("fetch('https://kjpvtgprikfnjkczbuyp.supabase.co/functions/v1/submit-form',{method:'POST'}).then(()=> 'REACHED').catch(()=> 'BLOCKED')")
    print("self-test:", ok)
    if ok!="BLOCKED": print("ABORT: isolation failed"); sys.exit(2)
    await pg.evaluate("document.querySelector('[id*=dl], .download-btn, a[href*=pdf], button')?.click()")
    for sel,val in [("input[type=email]","guard-demo@example.invalid"),("input[type=text]","Guard Demo")]:
      if await pg.locator(sel).count(): await pg.locator(sel).first.fill(val, force=True)
    await pg.evaluate("document.querySelector('form')?.requestSubmit()")
    await pg.wait_for_timeout(3000)
    await b.close()
  print("blocked:", *blocked, sep="\n  ")
  print("non-local responses received:", len(leaked))
  sys.exit(1 if leaked else 0)
asyncio.run(main())
