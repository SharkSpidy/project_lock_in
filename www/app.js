/* Lock-In app logic. Plain JS, no dependencies. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmt = s => { const d = parse(s); return DOW[d.getDay()] + " " + d.getDate() + " " + MON[d.getMonth()]; };
  const store = {
    get(k, f) { try { const v = localStorage.getItem("lockin:" + k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem("lockin:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const inPlan = s => s >= PLAN_START && s <= PLAN_END;

  // ---------- Build one day's events ----------
  function dayEvents(s) {
    if (!inPlan(s)) return [];
    const dow = parse(s).getDay(), plan = PLAN[s] || ["", "", ""], exam = EXAMS[s];
    const sunday = dow === 0, out = [];
    ROUTINE.forEach((r, i) => {
      let title = r.title, body = r.desc, t = r.t, end = r.end;
      if (r.k === "A") { if (!plan[0]) return; title = "Block A: " + plan[0]; body = "Deep work, 2 Pomodoro cycles (50/10)."; }
      else if (r.k === "B") {
        if (!plan[0]) return;
        title = "Block B: " + plan[0]; body = "3 cycles. Problems and handwritten answers.";
        if (sunday) { end = "11:30"; body = "Sunday: weekly review and mock test. Stop at 11:30."; }
        if (exam && /^EXAM/.test(plan[0])) { title = plan[0]; body = "Skim sheets only. Hall ticket, ID, pens. Read the whole paper first."; }
      }
      else if (r.k === "C") { if (!plan[1]) return; title = "Block C: " + plan[1]; }
      else if (r.k === "D") { if (!plan[2]) return; title = "Block D: " + plan[2]; }
      else if (r.k === "gym") {
        if (exam) { title = "Walk (exam day)"; body = "20-minute walk instead of the gym."; }
        else { title = "Gym: " + GYM[dow].split(": ")[1]; body = "10-min warm-up, 50 min lifting, 10-min stretch."; }
      }
      else if (r.desc === "meal:breakfast") { const m = BREAKFAST[dow]; title = "Breakfast (~" + m[1] + " kcal)"; body = m[0]; }
      else if (r.desc === "meal:dinner") { const m = DINNER[dow]; title = "Dinner (~" + m[1] + " kcal)"; body = m[0]; }
      if (sunday && (r.k === "A" || r.k === "B") === false && (r.k === "C" || r.k === "D")) return;
      out.push({ id: i, t, end, k: r.k, title, body, alarm: !!r.alarm });
    });
    // Exam eve reminder (day before exam)
    const next = addDays(s, 1);
    if (EXAMS[next]) out.push({ id: 90, t: "18:00", end: "18:05", k: "life", title: "Study ends. Exam tomorrow: " + EXAMS[next][0], body: "Pack hall ticket, ID, pens. In bed by 22:00.", alarm: true });
    out.sort((a, b) => a.t.localeCompare(b.t));
    return out;
  }

  // ---------- Notifications (APK: exact alarms. Browser: while open) ----------
  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const LN = isNative && Cap.Plugins ? Cap.Plugins.LocalNotifications : null;

  async function scheduleNative(days) {
    if (!LN) return "Not running inside the Android app.";
    const perm = await LN.requestPermissions();
    if (perm.display !== "granted") return "Notification permission was denied. Enable it in Android settings.";
    try { await LN.createChannel({ id: "lockin-alarm", name: "Lock-In alarms", importance: 5, visibility: 1, vibration: true, sound: "default" }); } catch (e) {}
    try { const p = await LN.getPending(); if (p.notifications.length) await LN.cancel({ notifications: p.notifications.map(n => ({ id: n.id })) }); } catch (e) {}
    const now = new Date(), list = [];
    const startDay = ymd(now) < PLAN_START ? PLAN_START : ymd(now);
    for (let i = 0; i < days; i++) {
      const s = addDays(startDay, i);
      dayEvents(s).forEach(e => {
        const at = parse(s); const [h, m] = e.t.split(":").map(Number); at.setHours(h, m, 0, 0);
        if (at <= now) return;
        list.push({ id: Number(s.replace(/-/g, "").slice(2)) * 100 + e.id, title: e.title, body: e.body, channelId: "lockin-alarm", schedule: { at, allowWhileIdle: true } });
      });
    }
    for (let i = 0; i < list.length; i += 100) await LN.schedule({ notifications: list.slice(i, i + 100) });
    store.set("scheduledAt", Date.now());
    return list.length + " alarms scheduled for the next " + days + " days.";
  }

  let timers = [];
  function scheduleBrowser() {
    timers.forEach(clearTimeout); timers = [];
    if (!("Notification" in window) || Notification.permission !== "granted") return 0;
    const now = Date.now(), s = ymd(new Date()); let n = 0;
    dayEvents(s).forEach(e => {
      const at = parse(s); const [h, m] = e.t.split(":").map(Number); at.setHours(h, m, 0, 0);
      const ms = at - now; if (ms <= 0) return;
      timers.push(setTimeout(() => { try { new Notification(e.title, { body: e.body, tag: "lockin-" + e.id, requireInteraction: e.alarm }); } catch (er) {} }, ms)); n++;
    });
    return n;
  }

  // ---------- Calendar (.ics) export with alarms ----------
  const icsEsc = t => String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  function fold(line) { let o = ""; while (line.length > 74) { o += line.slice(0, 74) + "\r\n "; line = line.slice(74); } return o + line; }
  const stamp = (s, t) => s.replace(/-/g, "") + "T" + t.replace(":", "") + "00";
  function buildICS(fromS, toS) {
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LockIn//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Lock-In Plan", "X-WR-TIMEZONE:Asia/Kolkata",
      "BEGIN:VTIMEZONE", "TZID:Asia/Kolkata", "BEGIN:STANDARD", "DTSTART:19700101T000000", "TZOFFSETFROM:+0530", "TZOFFSETTO:+0530", "TZNAME:IST", "END:STANDARD", "END:VTIMEZONE"];
    let s = fromS, n = 0;
    while (s <= toS) {
      dayEvents(s).forEach(e => {
        const endDay = e.end <= e.t ? addDays(s, 1) : s;
        L.push("BEGIN:VEVENT", "UID:lockin-" + s + "-" + e.id + "@lockin.app", "DTSTAMP:20261101T160000Z",
          "DTSTART;TZID=Asia/Kolkata:" + stamp(s, e.t), "DTEND;TZID=Asia/Kolkata:" + stamp(endDay, e.end),
          fold("SUMMARY:" + icsEsc(e.title)), fold("DESCRIPTION:" + icsEsc(e.body)),
          "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(e.title).slice(0, 60), "TRIGGER:-PT0M", "END:VALARM");
        if (e.alarm) L.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Coming up", "TRIGGER:-PT10M", "END:VALARM");
        L.push("END:VEVENT"); n++;
      });
      s = addDays(s, 1);
    }
    L.push("END:VCALENDAR");
    return { text: L.join("\r\n"), count: n };
  }
  function downloadICS() {
    const today = ymd(new Date());
    const from = today < PLAN_START ? PLAN_START : (today > PLAN_END ? PLAN_START : today);
    const { text, count } = buildICS(from, PLAN_END);
    const blob = new Blob([text], { type: "text/calendar" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "lock-in-plan.ics";
    document.body.appendChild(a); a.click(); a.remove();
    return count;
  }

  // ---------- Views ----------
  const view = $("#view");
  let tab = store.get("tab", "today"), selDate = ymd(new Date());
  if (!inPlan(selDate)) selDate = selDate < PLAN_START ? PLAN_START : PLAN_END;

  function nextExam(s) { const k = Object.keys(EXAMS).sort().find(d => d >= s); return k ? { d: k, n: EXAMS[k][0], days: Math.round((parse(k) - parse(s)) / 864e5) } : null; }

  function renderToday() {
    const real = ymd(new Date()), s = selDate, done = store.get("done:" + s, {});
    const ev = dayEvents(s), ne = nextExam(s), exam = EXAMS[s];
    const nowT = pad(new Date().getHours()) + ":" + pad(new Date().getMinutes());
    const dow = parse(s).getDay(), plan = PLAN[s] || ["", "", ""];
    const total = ev.filter(e => /^[ABCD]$/.test(e.k)).length, ok = ev.filter(e => /^[ABCD]$/.test(e.k) && done[e.id]).length;
    const kcalPlan = ev.some(e => e.k === "meal") ? 2460 : 0;
    let h = '<div class="nav"><button id="prev" aria-label="Previous day">‹</button><div class="date"><b>' + fmt(s) + '</b><span>' + (s === real ? "Today" : "Day " + (Math.round((parse(s) - parse(PLAN_START)) / 864e5) + 1) + " of 106") + '</span></div><button id="next" aria-label="Next day">›</button></div>';
    if (exam) h += '<div class="card exam"><b>EXAM DAY</b><br>' + esc(exam[0]) + " (" + exam[1] + ")</div>";
    else if (ne) h += '<div class="card"><span class="muted">Next exam</span><br><b>' + esc(ne.n) + "</b> in <b>" + ne.days + "</b> day" + (ne.days === 1 ? "" : "s") + " (" + fmt(ne.d) + ")</div>";
    h += '<div class="prog"><div style="width:' + (total ? ok / total * 100 : 0) + '%"></div></div><div class="muted small">' + ok + " of " + total + " study blocks done · target ~" + kcalPlan + " kcal</div>";
    h += '<div class="list">';
    ev.forEach(e => {
      const cur = s === real && e.t <= nowT && nowT < (e.end > e.t ? e.end : "24:00");
      h += '<label class="row k-' + e.k + (cur ? " now" : "") + (done[e.id] ? " done" : "") + '"><input type="checkbox" data-id="' + e.id + '"' + (done[e.id] ? " checked" : "") + '><span class="tm">' + e.t + '</span><span class="tx"><b>' + esc(e.title) + '</b><small>' + esc(e.body) + "</small></span>" + (e.alarm ? '<span class="bell">⏰</span>' : "") + "</label>";
    });
    h += "</div>";
    view.innerHTML = h;
    $("#prev").onclick = () => { if (selDate > PLAN_START) { selDate = addDays(selDate, -1); render(); } };
    $("#next").onclick = () => { if (selDate < PLAN_END) { selDate = addDays(selDate, 1); render(); } };
    view.querySelectorAll("input[type=checkbox]").forEach(cb => cb.onchange = () => { done[cb.dataset.id] = cb.checked; store.set("done:" + s, done); render(); });
    const n = $(".now"); if (n && s === real) n.scrollIntoView({ block: "center" });
  }

  function renderPlan() {
    const real = ymd(new Date()); let h = '<div class="list">';
    let s = PLAN_START;
    while (s <= PLAN_END) {
      const p = PLAN[s] || ["", "", ""], ex = EXAMS[s], dow = parse(s).getDay();
      h += '<div class="card plan' + (ex ? " exam" : "") + (s === real ? " today" : "") + '" data-d="' + s + '"><b>' + fmt(s) + "</b>" + (ex ? ' <span class="tag">EXAM · ' + esc(ex[0]) + "</span>" : "") +
        '<div class="small"><span class="lb">A+B</span> ' + esc(p[0]) + (p[1] ? '<br><span class="lb">C</span> ' + esc(p[1]) : "") + (p[2] ? '<br><span class="lb">D</span> ' + esc(p[2]) : "") + (dow === 0 ? '<br><span class="muted">Sunday: half day</span>' : "") + "</div></div>";
      s = addDays(s, 1);
    }
    view.innerHTML = h + "</div>";
    view.querySelectorAll(".plan").forEach(c => c.onclick = () => { selDate = c.dataset.d; tab = "today"; store.set("tab", tab); render(); });
    const t = $(".plan.today"); if (t) t.scrollIntoView({ block: "start" });
  }

  function renderMeals() {
    const dow = parse(selDate).getDay(); let h = "";
    h += '<div class="card"><b>Daily target: about 2,460 kcal</b><div class="small muted">Rough household-portion estimates, ~100 g protein. Adjust one snack (~250 kcal) if weight drifts over 1 kg in 2 weeks.</div></div>';
    h += '<div class="card"><b>Today (' + DOW[dow] + ")</b><div class='small'>06:00 Banana, water: 110<br>08:30 " + esc(BREAKFAST[dow][0]) + ": " + BREAKFAST[dow][1] + "<br>12:30 Kerala meals lunch: 780<br>16:30 Tea snack: 250<br>19:00 " + esc(DINNER[dow][0]) + ": " + DINNER[dow][1] + "<br>22:00 Warm milk: 120</div></div>";
    const tbl = (title, rows) => '<div class="card"><b>' + title + "</b><table>" + rows.map(r => "<tr><td>" + esc(r[0]) + "</td><td class='r'>" + r[1] + "</td></tr>").join("") + "</table></div>";
    const order = [1, 2, 3, 4, 5, 6, 0];
    h += tbl("Breakfast rotation", order.map(i => [DOW[i] + ": " + BREAKFAST[i][0], BREAKFAST[i][1]]));
    h += tbl("Lunch: Kerala meals (780 kcal)", LUNCH_TABLE);
    h += tbl("Tea snack options", SNACKS);
    h += tbl("Dinner rotation", order.map(i => [DOW[i] + ": " + DINNER[i][0], DINNER[i][1]]));
    h += tbl("Gym split (17:00 to 18:15)", [].concat(GYM.slice(1), GYM.slice(0, 1)).map(g => [g, ""]));
    view.innerHTML = h;
  }

  function renderExams() {
    const real = ymd(new Date()); const ehe = store.get("ehe", SYLLABUS["Electronic Hardware for Engineers"]);
    let h = "";
    Object.keys(EXAMS).sort().forEach(d => {
      const name = EXAMS[d][0], days = Math.round((parse(d) - parse(real)) / 864e5), mods = name === "Electronic Hardware for Engineers" ? ehe : (SYLLABUS[name] || []);
      h += '<details class="card"><summary><b>' + esc(name) + '</b> <span class="tag">' + EXAMS[d][1] + '</span><div class="small muted">' + fmt(d) + " · " + (days > 0 ? days + " days left" : days === 0 ? "today" : "done") + "</div></summary>";
      if (name === "Electronic Hardware for Engineers") {
        h += '<div class="small muted">No syllabus on hand. Type the real module names here when you get them; they save on this phone.</div>' + mods.map((m, i) => '<input class="ehe" data-i="' + i + '" value="' + esc(m) + '">').join("");
      } else h += "<ol class='small'>" + mods.map(m => "<li>" + esc(m) + "</li>").join("") + "</ol>";
      h += "</details>";
    });
    view.innerHTML = h;
    view.querySelectorAll(".ehe").forEach(inp => inp.onchange = () => { ehe[+inp.dataset.i] = inp.value; store.set("ehe", ehe); });
  }

  function renderAlarms() {
    const last = store.get("scheduledAt", 0);
    let h = '<div class="card"><b>' + (isNative ? "Android alarms" : "Reminders") + "</b>";
    if (isNative) {
      h += '<div class="small">Schedules exact alarms for the next 14 days: wake-up, every study block, meals, gym, wrap-up and sleep. The app refreshes them every time you open it. Last scheduled: ' + (last ? new Date(last).toLocaleString() : "never") + "</div>" +
        '<button class="btn" id="sched">Schedule alarms now</button><div id="msg" class="small"></div>';
    } else {
      h += '<div class="small">Browser notifications only fire while this page is open. For real alarms that ring even when the app is closed, use the calendar file below or the Android APK.</div>' +
        '<button class="btn" id="notif">Enable notifications (while open)</button><div id="msg" class="small"></div>';
    }
    h += "</div>";
    h += '<div class="card"><b>Calendar alarms (works on any Android phone)</b><div class="small">Downloads every event from today to 15 Feb with a notification at start time. Open the file, choose Google Calendar, and import into your account. Then in Calendar settings, turn on notifications and allow exact alarms.</div><button class="btn" id="ics">Download calendar file (.ics)</button><div id="msg2" class="small"></div></div>';
    h += '<div class="card"><b>Tip</b><div class="small">In Android settings, set this app to Unrestricted battery use so alarms are never delayed.</div></div>';
    view.innerHTML = h;
    if (isNative) $("#sched").onclick = async () => { $("#msg").textContent = "Working…"; $("#msg").textContent = await scheduleNative(14); };
    else $("#notif").onclick = async () => {
      if (!("Notification" in window)) { $("#msg").textContent = "This browser has no notification support."; return; }
      const p = await Notification.requestPermission(); const n = p === "granted" ? scheduleBrowser() : 0;
      $("#msg").textContent = p === "granted" ? n + " reminders set for the rest of today." : "Permission denied.";
    };
    $("#ics").onclick = () => { const c = downloadICS(); $("#msg2").textContent = c + " events exported."; };
  }

  function render() {
    document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.t === tab));
    ({ today: renderToday, plan: renderPlan, meals: renderMeals, exams: renderExams, alarms: renderAlarms })[tab]();
    if (tab !== "plan") window.scrollTo(0, 0);
  }
  document.querySelectorAll("nav button").forEach(b => b.onclick = () => { tab = b.dataset.t; store.set("tab", tab); render(); });

  // Expose for tests
  window.__lockin = { dayEvents, buildICS, PLAN, EXAMS };

  render();
  if (isNative) scheduleNative(14).catch(() => {}); else scheduleBrowser();
  setInterval(() => { if (tab === "today" && selDate === ymd(new Date())) renderToday(); }, 60000);
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
