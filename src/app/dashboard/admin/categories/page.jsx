import CategoriesManager from "@/components/dashboard/CategoriesManager";

export const metadata = {
  title: "Manage Categories | GestorFitness Admin",
  description: "Manage classes, forums, and specialty categories",
};

export default function AdminCategoriesPage() {
  return (
    <div className="p-4 md:p-8 pt-6">
      <CategoriesManager />
    </div>
  );
}
