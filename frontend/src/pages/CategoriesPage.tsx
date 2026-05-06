import { categories } from '../utils/mockData';

export function CategoriesPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Browse by Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className="group p-8 bg-card border border-border rounded-xl hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-muted-foreground">{category.count} items</p>
          </button>
        ))}
      </div>
    </div>
  );
}
