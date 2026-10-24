
export default function CategoryBar({
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
}) {
  return (
    <div className="category-bar">
      <button
        type="button"
        className={`category-button ${
          selectedCategory === "all" ? "active" : ""
        }`}
        onClick={() => onCategoryChange?.("all")}
      >
        All Products
      </button>

      {categories.map((category) => {
        const value =
          typeof category === "string" ? category : category.slug;

        const label =
          typeof category === "string"
            ? category.replace(/-/g, " ")
            : category.name || category.slug;

        return (
          <button
            key={value}
            type="button"
            className={`category-button ${
              selectedCategory === value ? "active" : ""
            }`}
            onClick={() => onCategoryChange?.(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}