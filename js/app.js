(function () {
  "use strict";

  const D = window.PORTAL_DATA;
  const S = D.student;
  const app = document.getElementById("app");
  const pageTitle = document.getElementById("pageTitle");

  /* ---------- helpers ---------- */
  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  const field = (label, value, required) =>
    `<div class="field"><div class="field-label">${esc(label)}${required ? '<span class="req">*</span>' : ""}</div><div class="field-value">${esc(value)}</div></div>`;

  function percent(attended, total) {
    if (!total) return "0.0";
    const p = Math.round((attended / total) * 10000) / 100;
    return Number.isInteger(p) ? p.toFixed(1) : String(p);
  }

  const paginator = () =>
    `<div class="paginator">
      <span><i class="material-icons">first_page</i></span>
      <span><i class="material-icons">chevron_left</i></span>
      <span class="cur">1</span>
      <span><i class="material-icons">chevron_right</i></span>
      <span><i class="material-icons">last_page</i></span>
    </div>`;

  /* Builds a data table that reflows into label/value stacks on phones. */
  function table(columns, rows, extraClass) {
    const head = columns.map((c) => `<th>${esc(c.label)}</th>`).join("");
    const body = rows.length
      ? rows
          .map(
            (r, i) =>
              "<tr>" +
              columns
                .map((c) => {
                  const raw = c.value(r, i);
                  const v = c.link ? `<span class="lnk">${esc(raw)}</span>` : esc(raw);
                  return `<td><span class="cell-label">${esc(c.label)}</span><span>${v}</span></td>`;
                })
                .join("") +
              "</tr>"
          )
          .join("")
      : `<tr class="no-rec"><td colspan="${columns.length}">No records found.</td></tr>`;
    return `<table class="dt ${extraClass || ""}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${paginator()}`;
  }

  /* Dropdown with search panel, like the portal's semester picker. */
  function createSelect({ label, options, auto, onChange }) {
    const wrap = el(`
      <div class="select${auto ? " auto" : ""}">
        <div class="select-box" tabindex="0">
          <span class="select-label">${esc(label)}</span>
          <div class="select-value${auto ? " placeholder" : ""}">${auto ? esc(label) : ""}</div>
          <i class="material-icons select-caret">${auto ? "search" : "arrow_drop_down"}</i>
        </div>
        <div class="select-panel">
          <div class="select-search"><input type="text" aria-label="Search" /><i class="material-icons">search</i></div>
          <div class="select-list"></div>
        </div>
      </div>`);
    const box = wrap.querySelector(".select-box");
    const valueEl = wrap.querySelector(".select-value");
    const input = wrap.querySelector("input");
    const list = wrap.querySelector(".select-list");

    function renderList(q) {
      const items = options.filter((o) => o.toLowerCase().includes((q || "").toLowerCase()));
      list.innerHTML = items.length
        ? items.map((o) => `<div class="select-option" data-v="${esc(o)}">${esc(o)}</div>`).join("")
        : `<div class="select-empty">No results found</div>`;
    }

    function close() {
      wrap.classList.remove("open");
      document.removeEventListener("click", outside, true);
    }
    function outside(e) {
      if (!wrap.contains(e.target)) close();
    }
    box.addEventListener("click", () => {
      if (wrap.classList.contains("open")) return close();
      input.value = "";
      renderList("");
      wrap.classList.add("open");
      document.addEventListener("click", outside, true);
      setTimeout(() => input.focus(), 0);
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        box.click();
      }
    });
    input.addEventListener("input", () => renderList(input.value));
    list.addEventListener("click", (e) => {
      const opt = e.target.closest(".select-option");
      if (!opt) return;
      valueEl.textContent = opt.dataset.v;
      valueEl.classList.remove("placeholder");
      wrap.classList.add("filled");
      close();
      onChange && onChange(opt.dataset.v);
    });
    return wrap;
  }

  function submitButton(text, icon) {
    return el(`<button class="btn" disabled><span class="btn-icon"><i class="material-icons">${icon || "save"}</i></span><span class="btn-text">${esc(text || "Submit")}</span></button>`);
  }

  /* Header form used by Time Table and Attendance pages. */
  function sectionForm(onSubmit) {
    const card = el(`<div class="card form-grid">
      ${field("Name", S.name)}
      ${field("Enrollment no", S.enrollmentNo)}
      ${field("Program", S.program)}
      ${field("Section", S.section)}
      ${field("Subsection", S.subsection)}
      <div class="spacer"></div>
      <div class="sel-slot"></div>
      <div class="btn-row"></div>
    </div>`);
    let chosen = null;
    const btn = submitButton("Submit", "save");
    const sel = createSelect({
      label: "Select Semester code *",
      options: D.semesterCodes,
      onChange: (v) => {
        chosen = v;
        btn.disabled = false;
      },
    });
    card.querySelector(".sel-slot").appendChild(sel);
    card.querySelector(".btn-row").appendChild(btn);
    btn.addEventListener("click", () => chosen && onSubmit(chosen));
    return card;
  }

  /* ---------- pages ---------- */
  const pages = {
    "personal-info": {
      title: "Student Personal Info",
      render() {
        const tabs = [
          {
            name: "Students Personal Info",
            body: () =>
              `<img class="photo" src="${esc(S.photo)}" alt="Student photo" />` +
              field("Enrollment No", S.enrollmentNo) +
              field("Student Name", S.name) +
              field("Institute Code:", S.instituteCode) +
              field("Academic Year", S.academicYear) +
              field("Admission Year", S.admissionYear) +
              field("Program", S.program) +
              field("Branch", S.branch) +
              field("Section", S.section),
          },
          {
            name: "Students Contact Info",
            body: () =>
              field("Mobile No", D.contact.mobile) +
              field("Email Id", D.contact.email) +
              field("Address", D.contact.address) +
              field("City", D.contact.city) +
              field("State", D.contact.state) +
              field("Pin Code", D.contact.pin),
          },
          {
            name: "Students Parents Info",
            body: () =>
              field("Father's Name", D.parents.fatherName) +
              field("Mother's Name", D.parents.motherName) +
              field("Guardian Mobile No", D.parents.guardianMobile),
          },
        ];
        const wrap = el(`<div class="tab-wrap">
          <div class="tabs">
            <button class="tab-arrow" data-dir="-1" aria-label="Previous tab"><i class="material-icons">chevron_left</i></button>
            <div class="tab-strip">${tabs.map((t, i) => `<button class="tab${i === 0 ? " active" : ""}" data-i="${i}">${esc(t.name)}</button>`).join("")}</div>
            <button class="tab-arrow" data-dir="1" aria-label="Next tab"><i class="material-icons">chevron_right</i></button>
          </div>
          <div class="card tab-card"></div>
        </div>`);
        const strip = wrap.querySelector(".tab-strip");
        const body = wrap.querySelector(".tab-card");
        let current = 0;
        function show(i) {
          current = Math.max(0, Math.min(tabs.length - 1, i));
          strip.querySelectorAll(".tab").forEach((b, j) => b.classList.toggle("active", j === current));
          const active = strip.children[current];
          strip.scrollLeft = active.offsetLeft - strip.offsetLeft;
          body.innerHTML = tabs[current].body();
        }
        strip.addEventListener("click", (e) => {
          const b = e.target.closest(".tab");
          if (b) show(+b.dataset.i);
        });
        wrap.querySelectorAll(".tab-arrow").forEach((a) => a.addEventListener("click", () => show(current + +a.dataset.dir)));
        app.appendChild(wrap);
        show(0);
      },
    },

    "time-table": {
      title: "Class Time Table",
      render() {
        const out = el(`<div></div>`);
        app.appendChild(
          sectionForm((sem) => {
            const rows = (D.timeTable[sem] || []);
            out.innerHTML = `<div class="card table-card">${table(
              [
                { label: "S.No", value: (r, i) => i + 1 },
                { label: "Day", value: (r) => r.day },
                { label: "Period", value: (r) => r.period },
                { label: "Subject Code", value: (r) => r.code },
                { label: "Subject", value: (r) => r.subject },
                { label: "Room", value: (r) => r.room },
              ],
              rows
            )}</div>`;
          })
        );
        app.appendChild(out);
      },
    },

    attendance: {
      title: "Attendance View",
      render() {
        const out = el(`<div></div>`);
        app.appendChild(
          sectionForm((sem) => {
            const rows = D.attendance[sem] || [];
            out.innerHTML = `<div class="card table-card">${table(
              [
                { label: "S.No", value: (r, i) => i + 1 },
                { label: "Sty no", value: (r) => r.sty },
                { label: "Subject Code", value: (r) => r.code },
                { label: "Subject", value: (r) => r.subject },
                { label: "Total Class", value: (r) => `${r.attended}/${r.total}` },
                { label: "Attendance %", value: (r) => percent(r.attended, r.total) },
              ],
              rows
            )}</div>`;
          })
        );
        app.appendChild(out);
      },
    },

    "registered-subjects": {
      title: "Registered Subjects",
      render() {
        const card = el(`<div class="card">
          ${field("Student Name", S.name)}
          ${field("Enrollment No.", S.enrollmentNo)}
          ${field("Program", S.programFull)}
          ${field("Branch", S.branch)}
          ${field("Lateral Entry", S.lateralEntry)}
          <div class="sel-slot"></div>
          <div class="btn-slot"></div>
        </div>`);
        const out = el(`<div></div>`);
        let chosen = null;
        const btn = submitButton("Submit (View)", "visibility");
        card.querySelector(".sel-slot").appendChild(
          createSelect({
            label: "Select Semester Code",
            options: D.semesterCodes,
            auto: true,
            onChange: (v) => {
              chosen = v;
              btn.disabled = false;
            },
          })
        );
        card.querySelector(".btn-slot").appendChild(btn);
        btn.addEventListener("click", () => {
          if (!chosen) return;
          const rows = D.attendance[chosen] || [];
          out.innerHTML = `<div class="card table-card">${table(
            [
              { label: "S.No", value: (r, i) => i + 1 },
              { label: "Subject Code", value: (r) => r.code },
              { label: "Subject", value: (r) => r.subject },
            ],
            rows
          )}</div>`;
        });
        app.appendChild(card);
        app.appendChild(out);
      },
    },

    "admit-card": {
      title: "Admit Card",
      render() {
        const card = el(`<div class="card">
          ${field("Enrollment No.", S.enrollmentNo, true)}
          ${field("Student Name", S.name, true)}
          ${field("Program", S.programFull, true)}
          ${field("Branch", S.branch, true)}
          ${field("Lateral Entry", S.lateralEntry, true)}
          ${field("Current Semester ", S.currentSemester, true)}
          <div class="divider"></div>
          <div class="sel-reg"></div>
          <div class="sel-exam"></div>
          <div class="btn-slot"></div>
          <div class="out" style="margin-top:24px"></div>
        </div>`);
        const state = { reg: null, exam: null };
        const btn = submitButton("Submit (View)", "visibility");
        const update = () => (btn.disabled = !(state.reg && state.exam));
        card.querySelector(".sel-reg").appendChild(
          createSelect({ label: "Registration Code *", options: D.registrationCodes, onChange: (v) => { state.reg = v; update(); } })
        );
        card.querySelector(".sel-exam").appendChild(
          createSelect({ label: "Exam Description *", options: D.examDescriptions, onChange: (v) => { state.exam = v; update(); } })
        );
        card.querySelector(".btn-slot").appendChild(btn);
        btn.addEventListener("click", () => {
          card.querySelector(".out").innerHTML = `<div class="msg">Admit card is not yet published for the selected examination.</div>`;
        });
        app.appendChild(card);
      },
    },

    result: {
      title: "Student Result",
      render() {
        const card = el(`<div class="card">
          ${field("Enrollment No.", S.enrollmentNo, true)}
          ${field("Student Name", S.name, true)}
          ${field("Program", S.programFull, true)}
          ${field("Branch", S.branch, true)}
          ${field("Lateral Entry", S.lateralEntry, true)}
          ${field("Current Semester ", S.currentSemester, true)}
          <div class="result-wrap" style="margin:44px -12px 0">
            ${table(
              [
                { label: "Semester", value: (r) => r.semester, link: true },
                { label: "Point Secured SGPA", value: (r) => r.points },
                { label: "Course Credits", value: (r) => r.courseCredits },
                { label: "Earned Credits", value: (r) => r.earnedCredits },
                { label: "SGPA", value: (r) => r.sgpa },
                { label: "CGPA", value: (r) => r.cgpa },
              ],
              D.results,
              "result-table"
            )}
          </div>
          <div class="notes">
            <p>Note 1 : Please Contact Our University Office in case any dispute or mismatch in data.</p>
            <p>Note 2 : This is a Computer Generated Report.</p>
          </div>
        </div>`);
        app.appendChild(card);
      },
    },
  };

  /* ---------- router / chrome ---------- */
  function route() {
    const key = (location.hash.replace(/^#\//, "") || "personal-info").split("?")[0];
    const page = pages[key] || pages["personal-info"];
    app.innerHTML = "";
    pageTitle.innerHTML = `<i class="material-icons">assignment_ind</i>${esc(page.title)}`;
    page.render();
    document.querySelectorAll(".menu-item").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#/" + key));
    document.body.classList.remove("menu-open");
    window.scrollTo(0, 0);
  }

  document.getElementById("welcome").textContent = `Welcome ${S.name} (Welcome to SOA)`;
  document.getElementById("userName").textContent = S.name;
  document.getElementById("openMenu").addEventListener("click", () => document.body.classList.add("menu-open"));
  document.getElementById("closeMenu").addEventListener("click", () => document.body.classList.remove("menu-open"));
  document.getElementById("overlay").addEventListener("click", () => document.body.classList.remove("menu-open"));
  document.querySelectorAll(".menu-parent").forEach((b) =>
    b.addEventListener("click", () => b.parentElement.classList.toggle("open"))
  );

  window.addEventListener("hashchange", route);
  route();
})();
