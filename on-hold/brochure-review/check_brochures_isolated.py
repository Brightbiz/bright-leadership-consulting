import asyncio,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
import fitz
OUT=Path('/tmp/browser/brochure-corrections')
OUT.mkdir(parents=True, exist_ok=True)
SLUGS=['executive-leadership-mastery','peak-performance','future-of-work','executive-alignment-index']
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,args=['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'])
  ctx=await browser.new_context(viewport={'width':1280,'height':1800},service_workers='block')
  blocked=[];external_responses=[];requests=[];errors=[]
  async def guard(route):
   u=urlparse(route.request.url)
   if u.hostname in {'localhost','127.0.0.1'} and u.port==8080 and route.request.method=='GET':
    await route.continue_()
   else:
    blocked.append({'method':route.request.method,'host':u.hostname,'path':u.path});await route.abort()
  await ctx.route('**/*',guard)
  ctx.on('response',lambda r:external_responses.append(r.url) if urlparse(r.url).hostname not in {'localhost','127.0.0.1'} else None)
  ctx.on('request',lambda r:requests.append({'method':r.method,'url':r.url}))
  page=await ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:8080/brochures/peak-performance-brochure.html')
  # Same template guards, pre-run failure probe: the request is intercepted before egress.
  probe=await page.evaluate("fetch('https://brightleadershipconsulting.com/isolation-probe', {method:'POST',body:'synthetic-test-only'}).then(()=>false).catch(()=>true)")
  assert probe and blocked[-1]['path']=='/isolation-probe','INCOMPLETE: isolation self-test failed'
  # Probe in popup verifies context-wide protection, not just the current tab.
  popup=await ctx.new_page();await popup.goto('http://localhost:8080')
  assert await popup.evaluate("fetch('https://example.invalid/isolation-probe').then(()=>false).catch(()=>true)")
  await popup.close()
  result=[]
  for slug in SLUGS:
   for width,height in [(1280,1800),(375,812)]:
    await page.set_viewport_size({'width':width,'height':height})
    await page.goto(f'http://localhost:8080/brochures/{slug}-brochure.html',wait_until='networkidle')
    assert await page.locator('input, form, #downloadOverlay').count()==0
    assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),slug+' overflow'
    assert await page.evaluate("!Array.from(document.querySelectorAll('*')).some(el => getComputedStyle(el,'::before').backgroundImage.includes('img-'))")
    await page.evaluate('window.printCalls=0;window.print=()=>{window.printCalls++}')
    btn=page.get_by_role('button',name='Print this brochure or save it as a PDF (opens the print dialog)')
    await btn.focus();assert await btn.evaluate('el=>el===document.activeElement')
    count=len(requests);await page.keyboard.press('Enter');assert await page.evaluate('window.printCalls')>=1;await page.evaluate('window.printCalls=0');await btn.click();await page.wait_for_timeout(150)
    assert await page.evaluate('window.printCalls')==1,(slug,width,await page.evaluate('window.printCalls'))
    assert len(requests)==count,'Download click made a request'
    await page.screenshot(path=str(OUT/f'{slug}-{width}.png'))
    result.append({'brochure':slug,'width':width,'forms':0,'keyboard_print':True,'mouse_print':True,'click_requests':0,'overflow':False})
   await page.set_viewport_size({'width':1280,'height':1800})
   await page.goto(f'http://localhost:8080/brochures/{slug}-brochure.html',wait_until='networkidle')
   await page.pdf(path=str(OUT/f'{slug}.pdf'),format='A4',print_background=True,prefer_css_page_size=True)
   doc=fitz.open(OUT/f'{slug}.pdf');texts=[p.get_text() for p in doc]
   last=texts[-1];assert len(last.strip())>350,slug+' footer-only or blank final PDF page: '+repr(last)
   for number,pdf_page in enumerate(doc,1):
    pdf_page.get_pixmap(matrix=fitz.Matrix(1.4,1.4)).save(OUT/f'{slug}-page-{number}.png')
   for number,text in enumerate(texts,1):
    print(slug,'page',number,'first:',repr(text[:120]),'last:',repr(text[-180:]))
   result.append({'brochure':slug,'pdf_pages':len(texts),'final_page_characters':len(last.strip()),'footer_only_final_page':False})
  assert not external_responses
  assert not errors,errors
  report={'self_test':'passed before brochure use','popup_probe':'blocked','production_egress':0,'nonlocal_responses':0,'live_records_created':0,'reason':'all external and non-GET requests aborted before egress; download buttons made no requests','blocked_attempts':blocked,'results':result,'runtime_errors':errors}
  (OUT/'results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
  await browser.close()
asyncio.run(main())
