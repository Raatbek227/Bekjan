export async function generateStaticParams() {
  // Перечисляем фейковые ID, чтобы Next.js смог создать под них заготовки index.html при сборке
  return [
    { id: '1' },
    { id: '2' },
    { id: 'preview' }
  ];
}

import ClientAdminPage from "../page";

export default function AdminIdPage({ params }) {
  // Можно пробросить params в клиентский компонент через props если потребуется:
  // return <ClientAdminPage params={params} />;
  // Сейчас рендерим как есть — клиентский компонент использует роутинг/серверные вызовы самостоятельно.
  return <ClientAdminPage />;
}
