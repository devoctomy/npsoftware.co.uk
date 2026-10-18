// Helpers for the profile page: role dates are "YYYY-MM" strings, and a role
// with no end date is current.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseMonth(value, now) {
  if (!value) return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  const [year, month] = String(value).split("-").map(Number);
  return { year, month };
}

// "Apr 2021", or "Present" for a missing end date.
export function formatMonth(value) {
  if (!value) return "Present";
  const { year, month } = parseMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

// LinkedIn-style length, counting both the first and last month:
// Apr 2021 - Oct 2026 is "5 yrs 7 mos".
export function duration(start, end, now = new Date()) {
  const a = parseMonth(start, now);
  const b = parseMonth(end, now);
  const months = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? "mo" : "mos"}`);
  return parts.join(" ") || "1 mo";
}

// Roles (newest first) grouped into runs at the same company, so several
// roles at one employer sit under one heading with the total time there.
export function groupByCompany(roles) {
  const groups = [];
  for (const role of roles) {
    const last = groups.at(-1);
    if (last && last.company === role.company) {
      last.roles.push(role);
      last.start = role.start;
    } else {
      groups.push({
        company: role.company,
        employment: role.employment,
        location: role.location,
        start: role.start,
        end: role.end,
        roles: [role]
      });
    }
  }
  return groups;
}
