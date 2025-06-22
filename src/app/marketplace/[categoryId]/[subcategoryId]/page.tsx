import { CategoryPage } from '@/components/pages/category-page';

export default function SubcategoryPageRoute({ 
  params 
}: { 
  params: { categoryId: string; subcategoryId: string } 
}) {
  return (
    <CategoryPage 
      categoryId={params.categoryId} 
      subcategoryId={params.subcategoryId} 
    />
  );
}
