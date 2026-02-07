import HealthCard from "../components/HealthCard";

export default function BMI() {
  return (
    <main className="min-h-screen w-full bg-black flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <HealthCard />
      </div>
    </main>
  );
}
