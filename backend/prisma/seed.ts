import { Role, TaskStatus } from "@prisma/client";
import { prisma } from "./client.js";
import bcrypt from "bcrypt";

async function main() {
  await prisma.user.deleteMany();
  await prisma.auditLog.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const users = [
    {
      email: "tom@example.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      projects: [
        {
          name: "Project Alpha for Tom",
          tasks: [
            { title: "Task A1 for Tom", status: TaskStatus.NEW },
            { title: "Task A2 for Tom", status: TaskStatus.IN_PROGRESS },
          ],
        },
        {
          name: "Project Beta for Tom",
          tasks: [
            { title: "Task B1 for Tom", status: TaskStatus.NEW },
            { title: "Task B2 for Tom", status: TaskStatus.DONE },
          ],
        },
      ],
    },
    {
      email: "bob@example.com",
      passwordHash: userPassword,
      role: Role.USER,
      projects: [
        {
          name: "Project Alpha for Bob",
          tasks: [
            { title: "Task A1 for Bob", status: TaskStatus.NEW },
            { title: "Task A2 for Bob", status: TaskStatus.IN_PROGRESS },
          ],
        },
        {
          name: "Project Beta for Bob",
          tasks: [
            { title: "Task B1 for Bob", status: TaskStatus.NEW },
            { title: "Task B2 for Bob", status: TaskStatus.DONE },
          ],
        },
      ],
    },
    {
      email: "mike@example.com",
      passwordHash: userPassword,
      role: Role.USER,
      projects: [
        {
          name: "Project Alpha for Mike",
          tasks: [
            { title: "Task A1 for Mike", status: TaskStatus.NEW },
            { title: "Task A2 for Mike", status: TaskStatus.IN_PROGRESS },
          ],
        },
        {
          name: "Project Beta for Mike",
          tasks: [
            { title: "Task B1 for Mike", status: TaskStatus.NEW },
            { title: "Task B2 for Mike", status: TaskStatus.DONE },
          ],
        },
      ],
    },
  ];

  for await (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        projects: {
          create: user.projects.map((project) => ({ name: project.name, tasks: { create: project.tasks } })),
        },
      },
    });
  }
}

main()
  .then(() => {
    console.info("Seeding complete!");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
