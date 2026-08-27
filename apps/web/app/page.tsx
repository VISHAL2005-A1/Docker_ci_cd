import prisma from "@repo/db/client";

export default async function Home() {
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

  const users = await prisma.user.findMany();

  return (
    <main>
      <h1>Database Connected</h1>

      {users.map((user) => (
        <div key={user.id}>
          {user.username}
        </div>
      ))}
    </main>
  );
}
export const revalidate=60;