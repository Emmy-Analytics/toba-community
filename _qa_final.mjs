// Final QA sweep: every page × viewport. Checks console errors, failed
// requests, broken images, horizontal overflow, unreachable footer,
// permanently-hidden reveal sections, and DOM growth after settle.
const PAGES = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html']
const ALL_VPS = [[355, 700], [375, 720], [393, 750], [430, 800], [768, 900], [1024, 800], [1440, 900], [1920, 1000]]
const GROUPS = [[0, 1, 2, 3], [4, 5], [6, 7]]
const VIEWPORTS = GROUPS[parseInt(process.env.QA_GROUP || '0', 10)].map(i => ALL_VPS[i])
const BASE = 'http://localhost:8377/'

export default async function run(page) {
  const results = []
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp[0], height: vp[1] })
    for (const p of PAGES) {
      const r = { viewport: vp.join('x'), page: p }
      const errs = [], fails = []
      const onConsole = m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)) }
      const onReqFail = rq => { if (!rq.url().includes('favicon')) fails.push(rq.url().split('/').pop() + ' ' + (rq.failure()?.errorText || '')) }
      page.on('console', onConsole); page.on('requestfailed', onReqFail)
      try {
        await page.goto(BASE + p, { waitUntil: 'load', timeout: 25000 })
        await page.waitForTimeout(600)
        // scroll to bottom to trigger observers, then settle
        await page.evaluate(async () => {
          await new Promise(res => {
            let y = 0
            const step = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(step, 60); else res() }
            step()
          })
        })
        await page.waitForTimeout(400)
        const m = await page.evaluate(() => {
          const doc = document.documentElement
          const hOverflow = doc.scrollWidth - doc.clientWidth
          // footer reachable: scroll to bottom, footer intersects viewport
          const f = document.querySelector('footer')
          let footerOk = false
          if (f) { const b = f.getBoundingClientRect(); footerOk = b.bottom > 0 && b.top < window.innerHeight }
          const imgs = [...document.querySelectorAll('img')]
          const broken = imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => (i.getAttribute('src') || '').slice(-60))
          const hiddenForever = [...document.querySelectorAll('[class*=reveal]')].filter(e => {
            const s = getComputedStyle(e); return s.opacity === '0' && !e.closest('[aria-hidden=true]')
          }).length
          return {
            hOverflow, footerOk, imgs: imgs.length, broken, hiddenForever,
            height: document.body.scrollHeight, domNodes: document.querySelectorAll('*').length
          }
        })
        Object.assign(r, m)
        // DOM growth check: scroll back and forth once, compare node count
        const n1 = m.domNodes
        await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(250)
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(250)
        const n2 = await page.evaluate(() => document.querySelectorAll('*').length)
        r.domGrowth = n2 - n1
        r.errors = errs; r.reqFails = fails
      } catch (e) {
        r.fatal = String(e).slice(0, 120)
      }
      page.off('console', onConsole); page.off('requestfailed', onReqFail)
      results.push(r)
    }
  }
  // summarize only interesting rows
  const fs = await import('fs')
  fs.writeFileSync('_qa_final_group' + groupIdx + '.json', JSON.stringify(results, null, 1))
  return results.map(r => ({
    vp: r.viewport, p: r.page,
    ...r.hOverflow > 2 ? { H_OVERFLOW: r.hOverflow } : {},
    ...!r.footerOk ? { FOOTER_UNREACHABLE: true } : {},
    ...r.broken?.length ? { BROKEN_IMG: r.broken } : {},
    ...r.hiddenForever ? { STUCK_HIDDEN: r.hiddenForever } : {},
    ...Math.abs(r.domGrowth) > 30 ? { DOM_GROWTH: r.domGrowth } : {},
    ...(r.errors?.length || r.reqFails?.length) ? { ERRORS: r.errors.concat(r.reqFails).slice(0, 4) } : {},
    ...r.fatal ? { FATAL: r.fatal } : {},
    h: r.height, ok: !r.H_OVERFLOW && !r.FOOTER_UNREACHABLE && !(r.BROKEN_IMG) && !r.STUCK_HIDDEN && !(r.ERRORS) && !r.FATAL && Math.abs(r.domGrowth || 0) <= 30 ? 'PASS' : 'ISSUE'
  }))
}
