import { Link } from 'react-router';
import { categories } from '../data/mockData';

export function CategoriesPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl mb-8">Browse Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/app"
            className="group bg-card border border-border rounded-xl p-8 hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xl mb-2">{category.name}</h3>
            <p className="text-muted-foreground">
              {category.count} items available
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
