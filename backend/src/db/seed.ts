import "dotenv/config";
import bcrypt from "bcrypt";
import { pool, query, withTransactions } from "../config/db.js";

const PASSWORD = "Test@1234";
const DAY = 86400000;
const COLUMNS = ["Todo", "In Progress", "Review", "Done"];

const USERS = [
  { key: "jomel", name: "Jomel Batan", email: "jomelbatan6@hops.com" },
  { key: "john", name: "John Doe", email: "john.doe@example.com" },
  { key: "jane", name: "Jane Smith", email: "jane.smith@example.com" },
  {
    key: "michael",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
  },
  { key: "emily", name: "Emily Davis", email: "emily.davis@example.com" },
  { key: "david", name: "David Wilson", email: "david.wilson@example.com" },
  { key: "sarah", name: "Sarah Brown", email: "sarah.brown@example.com" },
  { key: "daniel", name: "Daniel Garcia", email: "daniel.garcia@example.com" },
  {
    key: "olivia",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
  },
  { key: "ethan", name: "Ethan Anderson", email: "ethan.anderson@example.com" },
  { key: "ava", name: "Ava Thomas", email: "ava.thomas@example.com" },
  { key: "liam", name: "Liam Harris", email: "liam.harris@example.com" },
  { key: "mia", name: "Mia Clark", email: "mia.clark@example.com" },
  { key: "noah", name: "Noah Lewis", email: "noah.lewis@example.com" },
  {
    key: "isabella",
    name: "Isabella Walker",
    email: "isabella.walker@example.com",
  },
  { key: "james", name: "James Hall", email: "james.hall@example.com" },
  {
    key: "charlotte",
    name: "Charlotte Allen",
    email: "charlotte.allen@example.com",
  },
  {
    key: "benjamin",
    name: "Benjamin Young",
    email: "benjamin.young@example.com",
  },
  { key: "amelia", name: "Amelia King", email: "amelia.king@example.com" },
  { key: "lucas", name: "Lucas Wright", email: "lucas.wright@example.com" },
  { key: "harper", name: "Harper Scott", email: "harper.scott@example.com" },
];
const BOARDS = [
  {
    title: "Product Roadmap",
    description: "Quarterly planning, OKRs, and feature prioritization.",
    color: "#a13431",
    owner: "jomel",
    member: ["john", "jane", "michael", "emily"],
    updatedDaysAgo: 0.3,
    tasks: [
      "Define Q3 OKRs",
      "Prioritize feature backlog",
      "User interview synthesis",
      "Pricing experiment plan",
      "Competitor analysis",
      "Leadership roadmap review",
    ],
  },
  {
    title: "Mobile App Redesign",
    description: "Improve UX and prepare the next major mobile release.",
    color: "#3b82f6",
    owner: "jane",
    member: ["jomel", "john", "olivia", "ethan"],
    updatedDaysAgo: 1,
    tasks: [
      "Create onboarding mockups",
      "Review navigation flow",
      "Update design system",
      "Implement dark mode",
      "Accessibility audit",
      "Sprint demo preparation",
    ],
  },
  {
    title: "Backend API",
    description: "Develop and maintain scalable backend services.",
    color: "#10b981",
    owner: "jomel",
    member: ["john", "michael", "david", "liam"],
    updatedDaysAgo: 2,
    tasks: [
      "JWT authentication",
      "Optimize database indexes",
      "Add audit logging",
      "Socket event improvements",
      "Write API documentation",
      "Performance testing",
    ],
  },
  {
    title: "Marketing Campaign",
    description: "Coordinate launch activities for the upcoming release.",
    color: "#f59e0b",
    owner: "jomel",
    member: ["emily", "ava", "mia", "harper"],
    updatedDaysAgo: 4,
    tasks: [
      "Finalize campaign slogan",
      "Schedule social media posts",
      "Prepare launch email",
      "Design promotional banner",
      "Coordinate influencers",
      "Measure campaign KPIs",
    ],
  },
  {
    title: "Customer Success",
    description: "Track customer feedback and improve user satisfaction.",
    color: "#8b5cf6",
    owner: "michael",
    member: ["jomel", "sarah", "daniel", "charlotte"],
    updatedDaysAgo: 0.8,
    tasks: [
      "Review support tickets",
      "Collect feature requests",
      "Update knowledge base",
      "Plan customer webinar",
      "NPS survey analysis",
      "Monthly feedback report",
    ],
  },
  {
    title: "Engineering Sprint",
    description: "Current sprint planning and development tracking.",
    color: "#ef4444",
    owner: "jomel",
    member: ["liam", "benjamin", "isabella", "lucas"],
    updatedDaysAgo: 0.1,
    tasks: [
      "Fix authentication bug",
      "Complete notification service",
      "Code review pending PRs",
      "Refactor user module",
      "Increase test coverage",
      "Sprint retrospective",
    ],
  },
];

const COL_CYCLE = [0, 1, 1, 2, 3, 0, 2, 3, 1, 3, 0, 1];
const PRIO_CYCLE = [
  "medium",
  "high",
  "low",
  "urgent",
  "medium",
  "high",
  "low",
  "urgent",
];
const DUE_CYCLE = [
  -9,
  2,
  null,
  5,
  -2,
  14,
  1,
  null,
  20,
  -4,
  6,
  9,
  3,
  null,
  12,
  -1,
  7,
];

async function run() {
  await withTransactions(async (c) => {
    await c.query("DELETE FROM users WHERE email = ANY($1)", [
      USERS.map((u) => u.email.toLowerCase()),
    ]);

    const hash = await bcrypt.hash(PASSWORD, 10);
    const uid: Record<string, number> = {};
    for (const u of USERS) {
      const { rows } = await c.query(
        `
            INSERT INTO users (name, email, password_hash, created_at)
            VALUES ($1, $2, $3, now() - interval '60 days') RETURNING id`,
        [u.name, u.email.toLowerCase(), hash],
      );
      uid[u.key] = rows[0].id;
    }

    let taskTotal = 0;

    for (const b of BOARDS) {
      const ownerId = uid[b.owner];
      const updateAt = new Date(Date.now() - b.updatedDaysAgo * DAY);

      const { rows: br } = await c.query(
        `
        INSERT INTO boards (title, description, color, owner_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, now() - interval '45 days', $5) RETURNING id`,
        [b.title, b.description, b.color, ownerId, updateAt],
      );

      const boardId = br[0].id;

      let memberKeys = [b.owner, ...b.member];
      if (!memberKeys.includes("jomel")) memberKeys.push("jomel");
      memberKeys = [...new Set(memberKeys)];

      for (let mi = 0; mi < memberKeys.length; mi++) {
        const mk = memberKeys[mi]!;
        const role = mk === b.owner ? "owner" : mi === 1 ? "admin" : "member";

        await c.query(
          `
            INSERT INTO board_members (board_id, user_id, role)
            VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [boardId, uid[mk], role],
        );
      }
      const colIds = [];
      for (let i = 0; i < COLUMNS.length; i++) {
        const { rows: cr } = await c.query(
          `INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
          [boardId, COLUMNS[i], (i + 1) * 1000],
        );
        colIds.push(cr[0].id);
      }
      const assignPool = ["jomel", "jomel", ...memberKeys];

      for (let i = 0; i < b.tasks.length; i++) {
        const colIdx = COL_CYCLE[i % COL_CYCLE.length];
        const priority = PRIO_CYCLE[(i + b.title.length) % PRIO_CYCLE.length];
        const offset = DUE_CYCLE[(i + b.tasks.length) % DUE_CYCLE.length];
        const dueDate =
          offset === null ? null : new Date(Date.now() + offset! * DAY);
        const assigneeKey =
          i % 5 === 4 ? null : assignPool[i % assignPool.length];
        const assineeId = assigneeKey ? uid[assigneeKey] : null;

        await c.query(
          `
            INSERT INTO task
                (board_id, column_id, title, description, priority, due_date, assignee_id, position, created_by, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now() - interval '20 days', $10)`,
          [
            boardId,
            colIds[colIdx!],
            b.tasks[i],
            i % 3 === 0
              ? `${b.tasks[i]} - details and acceptance criteria`
              : null,
            priority,
            dueDate,
            assineeId,
            (i + 1) * 1000,
            ownerId,
            updateAt,
          ],
        );
        taskTotal += 1;
      }
      const ownerName = USERS.find((u) => u.key === b.owner)?.name;
      const acts = [
        { action: "board:created", message: `${ownerName} created the board` },
        { action: "task:created", message: `${ownerName} added ${b.tasks[0]}` },
        {
          action: "task:moved",
          message: `${USERS.find((u) => u.key === memberKeys[1] || u.key === b.owner)?.name || ownerName} moved "${b.tasks[Math.min(3, b.tasks.length - 1)]}" to Done`,
        },
      ];
      for (let ai = 0; ai < acts.length; ai++) {
        await c.query(
          `
            INSERT INTO activities (board_id, user_id, action, message, created_at)
            VALUES ($1, $2, $3, $4, now() - ($5 || ' hours')::interval)`,
          [boardId, ownerId, acts[ai]?.action, acts[ai]?.message, (ai + 1) * 7],
        );
      }
    }
    return taskTotal;
  }).then((taskTotal) => {
    console.log("DEMO workspace seeded.");
    console.log(
      `Users: ${USERS.length} - Boards: ${BOARDS.length} - Tasks: ${taskTotal}`,
    );
    console.log("Login: jomelbatan@hops.com / Test@1234");
    console.log(" (teammates share the same password)");
  });
}

run()
  .catch((err) => {
    console.error("Send failed", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
