import CategoriesManager from "@/components/dashboard/CategoriesManager";

export const metadata = {
  title: "Manage Categories | GestorFitness Admin",
  description: "Manage classes, forums, and specialty categories",
};

export default function AdminCategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
      </div>
      <CategoriesManager />
    </div>
  );
}
