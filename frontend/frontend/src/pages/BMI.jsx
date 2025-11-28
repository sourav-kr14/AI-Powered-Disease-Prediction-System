import HealthCard from "../components/HealthCard";

export default function BMI() {
  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-center mb-4">
          ⚕️ BMI & Health Checker
        </h1>

        <HealthCard />
      </div>
    </div>
  );
}
