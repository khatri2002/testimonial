export const dynamic = "force-dynamic";

interface TestimonialLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function TestimonialLayout({
  children,
}: TestimonialLayoutProps) {
  return <main>{children}</main>;
}
