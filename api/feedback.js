/* "Report a bug or idea" from the website: each report becomes an issue in the game's GitHub repository.
   Needs one setting in Vercel: GITHUB_TOKEN, a fine-grained GitHub token with "Issues: read and write" on this repository.
   FEEDBACK_REPO (owner/name) is optional. */
const REPO = process.env.FEEDBACK_REPO || 'Cr45h0v3rR1D3-DEF/damage-control';
const KINDS = { bug: 'Bug', idea: 'Idea', other: 'Report' };
const recent = new Map(); // a few reports per address per ten minutes, while this instance is warm

const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').slice(0, n);
const noPing = s => s.replace(/@/g, '@​'); // a report cannot mention or notify anyone

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  const origin = req.headers.origin;
  if (origin) { let host = ''; try { host = new URL(origin).hostname; } catch (e) {} if (!/(^|\.)damage-control[\w-]*\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(host)) return res.status(403).json({ ok: false }); }
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ ok: false, why: 'not set up' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ ok: false });
  const text = clean(b.text, 2000).trim();
  if (text.length < 3) return res.status(400).json({ ok: false });
  const kind = KINDS[b.kind] ? b.kind : 'other', name = clean(b.name, 40).trim();
  let info = '';
  try { info = JSON.stringify(b.info && typeof b.info === 'object' ? b.info : {}, null, 1).slice(0, 6000); } catch (e) {}

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '?', now = Date.now();
  const times = (recent.get(ip) || []).filter(t => now - t < 600000);
  if (times.length >= 5) return res.status(429).json({ ok: false });
  times.push(now); recent.set(ip, times);

  const fence = s => s.replace(/~~~/g, '~ ~ ~');
  const title = noPing('[' + kind + '] ' + text.split('\n')[0].slice(0, 70));
  const body = [
    '**' + KINDS[kind] + '**' + (name ? ' from ' + noPing(name) : '') + (b.info && b.info.ver ? ' · ' + clean(b.info.ver, 12) : ''),
    '', '~~~text', fence(noPing(text)), '~~~', '',
    '<details><summary>Game details</summary>', '', '~~~json', fence(noPing(info)), '~~~', '</details>',
    '', '_Sent from the game\'s "Report a bug or idea" button._'
  ].join('\n');

  try {
    const r = await fetch('https://api.github.com/repos/' + REPO + '/issues', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'damage-control-feedback', 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    if (!r.ok) return res.status(502).json({ ok: false });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
