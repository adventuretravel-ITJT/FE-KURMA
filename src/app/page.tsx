async function getHealth() {
  const res = await fetch(`${process.env.API_URL}/api/health`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data dari Lumen");
  }

  return res.json();
}

export default async function Home() {
  const data = await getHealth();

  return (
    <main style={{ padding: 24 }}>
      <h1>Next.js terhubung ke Lumen</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}