import { CategoryPage } from '@/components/pages/category-page';

export default function CategoryPageRoute({ params }: { params: { categoryId: string } }) {
  return <CategoryPage categoryId={params.categoryId} />;
}
